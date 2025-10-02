import { getLanguageData, getAllLanguages } from '../../../utils/docsFileSystem';

export default function handler(req, res) {
  try {
    const { lang } = req.query;
    const language = lang || 'en';
    
    const languageData = getLanguageData(language);
    const allLanguages = getAllLanguages();
    
    res.status(200).json({
      ...languageData,
      availableLanguages: allLanguages.map(l => l.code)
    });
  } catch (error) {
    console.error('Error in docs structure API:', error);
    res.status(500).json({ error: 'Failed to load documentation structure' });
  }
}
