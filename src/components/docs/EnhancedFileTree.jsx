import React, { useState } from 'react';
import { useDocs } from '../../contexts/DocsContext';

const FileTreeSection = ({ section, onFileSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderItem = (item, depth = 0) => {
    const isSelected = selectedFile?.id === item.id;
    const paddingLeft = `${depth * 16 + 8}px`;

    if (item.type === 'folder') {
      return (
        <div key={item.id}>
          <div 
            className="tree-folder"
            style={{ paddingLeft }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
            <span className="folder-name">{item.title}</span>
          </div>
          {isExpanded && item.children && (
            <div className="folder-children">
              {item.children.map(child => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`tree-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft }}
        onClick={() => onFileSelect(item)}
      >
        <span className="file-icon">📄</span>
        <span className="file-name">{item.title}</span>
        <div className="file-meta">
          <span className={`difficulty-badge ${item.difficulty?.toLowerCase()}`}>
            {item.difficulty}
          </span>
          {item.tags && (
            <div className="tag-list">
              {item.tags.slice(0, 2).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tree-section">
      <div 
        className="section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="section-icon">{section.icon}</span>
        <span className="section-title">{section.title}</span>
        <span className="section-toggle">{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {section.items?.map(item => renderItem(item)) || (
            <div className="no-items">No items available</div>
          )}
        </div>
      )}
    </div>
  );
};

const EnhancedFileTree = () => {
  const { fileTree, selectedFile, selectFile } = useDocs();

  if (!fileTree || fileTree.length === 0) {
    return (
      <div className="enhanced-file-tree">
        <div className="no-content">No documentation available</div>
      </div>
    );
  }

  return (
    <div className="enhanced-file-tree">
      {fileTree.map(section => (
        <FileTreeSection
          key={section.id}
          section={section}
          selectedFile={selectedFile}
          onFileSelect={selectFile}
        />
      ))}
    </div>
  );
};

export default EnhancedFileTree;
