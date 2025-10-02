import React, { createContext, useContext, useState, useEffect } from 'react';

const DocsContext = createContext();

export const useDocs = () => {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error('useDocs must be used within a DocsProvider');
  }
  return context;
};

export const DocsProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState(['en']);

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    ja: { name: '日本語', flag: '🇯🇵' },
    zh: { name: '中文', flag: '🇨🇳' },
    ru: { name: 'Русский', flag: '🇷🇺' }
  };

  const loadDocumentation = async (language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API endpoint to get docs structure from filesystem
      const response = await fetch(`/api/docs/structure?lang=${language}`);
      if (!response.ok) throw new Error('Failed to load documentation structure');
      
      const data = await response.json();
      
      if (data.sections) {
        setFileTree(data.sections);
        setAvailableLanguages(data.availableLanguages || ['en']);
        
        // Auto-select first file if none selected
        if (!selectedFile) {
          const firstFile = findFirstFile(data.sections);
          if (firstFile) {
            setSelectedFile(firstFile);
          }
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load documentation:', err);
    } finally {
      setLoading(false);
    }
  };

  const findFirstFile = (sections) => {
    for (const section of sections) {
      if (section.items) {
        for (const item of section.items) {
          if (item.type === 'file') return item;
          if (item.children) {
            const found = findFirstFile([{ items: item.children }]);
            if (found) return found;
          }
        }
      }
    }
    return null;
  };

  const switchLanguage = (language) => {
    setCurrentLanguage(language);
    setSelectedFile(null);
    loadDocumentation(language);
  };

  const selectFile = (file) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    loadDocumentation(currentLanguage);
  }, []);

  const value = {
    currentLanguage,
    availableLanguages,
    languages,
    fileTree,
    selectedFile,
    loading,
    error,
    switchLanguage,
    selectFile,
    refreshDocs: () => loadDocumentation(currentLanguage)
  };

  return (
    <DocsContext.Provider value={value}>
      {children}
    </DocsContext.Provider>
  );
};
