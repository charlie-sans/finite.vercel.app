import React, { useState, useEffect } from 'react';
import documentationFiles from './data';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../styles/documentation.css';
import { FaCode, FaRocket, FaBook, FaCog, FaTerminal, FaLightbulb, FaQuestionCircle, FaGithub } from 'react-icons/fa';

// Lazy load SyntaxHighlighter
const SyntaxHighlighter = React.lazy(() =>
  Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism')
  ]).then(([syntaxModule, styleModule]) => ({
    default: ({ children, language, style, ...props }) => {
      const { Prism } = syntaxModule;
      const vscDarkPlus = styleModule.vscDarkPlus;
      
      return (
        <Prism
          language={language}
          style={style || vscDarkPlus}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </Prism>
      );
    }
  }))
);

// Metro documentation tiles
const docTiles = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Begin your journey with our tools and languages',
    icon: <FaRocket />,
    colorClass: 'tile-blue-clear',
    items: ['README.md']
  },
  {
    id: 'masm-docs',
    title: 'MicroASM',
    description: 'Assembly language documentation and guides',
    icon: <FaTerminal />,
    colorClass: 'tile-green-clear',
    items: ['spec/v1instructions.md', 'spec/spec.md', 'spec/MASMBasics.md', 'spec/includes.md', 'spec/memory.md', 'spec/min.md']
  },
  {
    id: 'uhigh-docs',
    title: 'μHigh Language',
    description: 'Modern programming language documentation',
    icon: <FaCode />,
    colorClass: 'tile-purple-clear',
    items: ['uhigh/getting-started.md', 'uhigh/syntax.md', 'uhigh/stdlib.md']
  },
  {
    id: 'stdlib',
    title: 'Standard Libraries',
    description: 'Built-in functions and utilities',
    icon: <FaBook />,
    colorClass: 'tile-orange-clear',
    items: ['stdlib/stdio.print.md']
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: 'Step-by-step learning guides',
    icon: <FaLightbulb />,
    colorClass: 'tile-cyan-clear',
    items: ['tutorials/hello-world.md']
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation',
    icon: <FaCog />,
    colorClass: 'tile-red-clear',
    items: ['api/overview.md']
  }
];

const MetroDocumentationTile = ({ tile, onFileSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`metro-doc-tile ${tile.colorClass}`}>
      <div className="metro-doc-tile-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="tile-icon">{tile.icon}</div>
        <div className="tile-content">
          <div className="tile-title">{tile.title}</div>
          <div className="tile-description">{tile.description}</div>
        </div>
        <div className="tile-expand">{isExpanded ? '▼' : '▶'}</div>
      </div>
      
      {isExpanded && (
        <div className="metro-doc-tile-items">
          {tile.items.map((item) => {
            const file = findFileByPath(documentationFiles, item);
            if (!file) return null;
            
            const isSelected = selectedFile?.path === file.path;
            
            return (
              <div
                key={item}
                className={`metro-doc-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onFileSelect(file)}
              >
                <span className="doc-item-icon">📄</span>
                <span className="doc-item-name">{file.name}</span>
                {file.metadata?.difficulty && (
                  <span className={`difficulty-badge ${file.metadata.difficulty.toLowerCase()}`}>
                    {file.metadata.difficulty}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to find files by path
const findFileByPath = (files, targetPath) => {
  for (const item of files) {
    if (item.path === targetPath) return item;
    if (item.children) {
      const found = findFileByPath(item.children, targetPath);
      if (found) return found;
    }
  }
  return null;
};

const Documentation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!selectedFile) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/docs/${selectedFile.path}`);
        if (!response.ok) throw new Error('Failed to fetch document');
        const content = await response.text();
        setMarkdown(content);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMarkdown('');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [selectedFile]);

  return (
    <div className="metro-docs-container">
      {/* Metro Header */}
      <div className="metro-docs-header">
        <div className="floating-particles">
          <div className="particle particle-1">📚</div>
          <div className="particle particle-2">⚡</div>
          <div className="particle particle-3">🔧</div>
          <div className="particle particle-4">💡</div>
        </div>
        
        <h1 className="metro-docs-title">Documentation</h1>
        <p className="metro-docs-subtitle">Comprehensive guides and references for all Finite tools</p>
        
        <div className="metro-docs-stats">
          <div className="stat-item">
            <span className="stat-number">{docTiles.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">25+</span>
            <span className="stat-label">Documents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Languages</span>
          </div>
        </div>
      </div>

      {!selectedFile ? (
        // Metro Tile Grid View
        <div className="metro-docs-grid">
          <div className="metro-grid">
            {docTiles.map((tile) => (
              <MetroDocumentationTile
                key={tile.id}
                tile={tile}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />
            ))}
          </div>
          
          {/* Quick Links Section */}
          <div className="metro-quick-links">
            <h2>Quick Start</h2>
            <div className="quick-links-grid">
              <a href="/masm" className="quick-link tile-green-clear">
                <FaTerminal />
                <span>Try MicroASM</span>
              </a>
              <a href="/microhigh" className="quick-link tile-purple-clear">
                <FaCode />
                <span>Explore μHigh</span>
              </a>
              <a href="https://github.com/fy-nite" className="quick-link tile-orange-clear">
                <FaGithub />
                <span>View Source</span>
              </a>
              <a href="/contact" className="quick-link tile-cyan-clear">
                <FaQuestionCircle />
                <span>Get Help</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        // Document View
        <div className="metro-docs-viewer">
          <div className="metro-docs-nav">
            <button 
              className="back-btn primary-btn"
              onClick={() => setSelectedFile(null)}
            >
              ← Back to Documentation
            </button>
            <div className="breadcrumb">
              <span>Documentation</span>
              <span> / </span>
              <span>{selectedFile.name}</span>
            </div>
          </div>
          
          <div className="metro-doc-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading documentation...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <h2>Document Not Found</h2>
                <p>The requested documentation could not be loaded.</p>
                <button className="primary-btn" onClick={() => setSelectedFile(null)}>
                  Return to Documentation
                </button>
              </div>
            ) : (
              <div className="documentation-content">
                {selectedFile.metadata && (
                  <div className="doc-metadata metro-card">
                    <div className="metadata-header">
                      <h1>{selectedFile.name.replace('.md', '')}</h1>
                      <div className="metadata-badges">
                        <span className={`difficulty-badge ${selectedFile.metadata.difficulty?.toLowerCase()}`}>
                          {selectedFile.metadata.difficulty}
                        </span>
                        {selectedFile.metadata.tags?.map(tag => (
                          <span key={tag} className="tag-badge">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="metadata-details">
                      <span>Last updated: {new Date(selectedFile.metadata.lastUpdated).toLocaleDateString()}</span>
                      <span>Author: {selectedFile.metadata.author}</span>
                    </div>
                  </div>
                )}
                
                <div className="markdown-content metro-card">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <React.Suspense fallback={
                            <pre className="code-fallback">
                              <code>{String(children).replace(/\n$/, '')}</code>
                            </pre>
                          }>
                            <SyntaxHighlighter language={match[1]}>
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </React.Suspense>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {markdown}
                  </Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;