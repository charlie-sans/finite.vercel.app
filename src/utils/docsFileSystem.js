import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');

// Language metadata
const LANGUAGE_CONFIG = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' },
  ru: { name: 'Русский', flag: '🇷🇺' }
};

// Section metadata with icons
const SECTION_CONFIG = {
  'getting-started': { title: 'Getting Started', icon: '🚀' },
  'comenzando': { title: 'Comenzando', icon: '🚀' },
  'language-reference': { title: 'Language Reference', icon: '📚' },
  'reference': { title: 'Reference', icon: '📚' },
  'standard-library': { title: 'Standard Library', icon: '📦' },
  'stdlib': { title: 'Standard Library', icon: '📦' },
  'tutorials': { title: 'Tutorials', icon: '🎓' },
  'api': { title: 'API Reference', icon: '🔧' },
  'examples': { title: 'Examples', icon: '💡' }
};

const getDifficultyFromContent = (content) => {
  const lower = content.toLowerCase();
  if (lower.includes('beginner') || lower.includes('introduction') || lower.includes('hello')) return 'Beginner';
  if (lower.includes('advanced') || lower.includes('expert')) return 'Advanced';
  return 'Intermediate';
};

const getTagsFromPath = (filePath) => {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace('.md', '');
  const tags = [];
  
  // Add section-based tags
  if (parts.includes('getting-started') || parts.includes('comenzando')) tags.push('beginner');
  if (parts.includes('tutorials')) tags.push('tutorial');
  if (parts.includes('reference')) tags.push('reference');
  if (parts.includes('stdlib')) tags.push('stdlib');
  if (parts.includes('api')) tags.push('api');
  
  // Add filename-based tags
  tags.push(fileName.replace(/-/g, ' '));
  
  return tags;
};

const scanDirectory = (dirPath, relativePath = '') => {
  const items = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativeFilePath = path.join(relativePath, entry.name).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        const children = scanDirectory(fullPath, relativeFilePath);
        if (children.length > 0) {
          items.push({
            id: entry.name,
            title: entry.name.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            type: 'folder',
            children
          });
        }
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const title = entry.name.replace('.md', '').split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        items.push({
          id: entry.name.replace('.md', ''),
          title,
          type: 'file',
          path: relativeFilePath,
          tags: getTagsFromPath(relativeFilePath),
          difficulty: getDifficultyFromContent(content)
        });
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dirPath}:`, error.message);
  }
  
  return items;
};

export const scanDocsStructure = () => {
  const structure = { languages: {} };
  
  try {
    const languageDirs = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    for (const langCode of languageDirs) {
      if (!LANGUAGE_CONFIG[langCode]) continue;
      
      const langDir = path.join(DOCS_DIR, langCode);
      const sections = [];
      
      const sectionDirs = fs.readdirSync(langDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
      
      for (const sectionName of sectionDirs) {
        const sectionPath = path.join(langDir, sectionName);
        const items = scanDirectory(sectionPath, `${langCode}/${sectionName}`);
        
        if (items.length > 0) {
          const sectionConfig = SECTION_CONFIG[sectionName] || {
            title: sectionName.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            icon: '📄'
          };
          
          sections.push({
            id: sectionName,
            title: sectionConfig.title,
            icon: sectionConfig.icon,
            items
          });
        }
      }
      
      structure.languages[langCode] = {
        ...LANGUAGE_CONFIG[langCode],
        sections
      };
    }
  } catch (error) {
    console.error('Error scanning docs structure:', error);
  }
  
  return structure;
};

export const getLanguageData = (language) => {
  const structure = scanDocsStructure();
  return structure.languages[language] || structure.languages.en || { sections: [] };
};

export const getAllLanguages = () => {
  const structure = scanDocsStructure();
  return Object.keys(structure.languages).map(code => ({
    code,
    ...structure.languages[code]
  }));
};
