// Theme configurations for different content types
export const themes = {
  reference: {
    primaryColor: '#60a5fa',
    backgroundColor: '#1e1e2e',
    accentColor: '#94a3b8'
  },
  tutorial: {
    primaryColor: '#34d399',
    backgroundColor: '#064e3b',
    accentColor: '#6ee7b7'
  },
  api: {
    primaryColor: '#f59e0b',
    backgroundColor: '#451a03',
    accentColor: '#fbbf24'
  }
};

// Re-export filesystem utilities
export { getLanguageData, getAllLanguages } from '../utils/docsFileSystem';
