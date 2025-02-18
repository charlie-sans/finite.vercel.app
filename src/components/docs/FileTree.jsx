import { useState } from 'react'

const FileTreeItem = ({ item, selectedFile, onSelect, depth = 0 }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onSelect(item);
    };

    const isSelected = selectedFile?.path === item.path;
    
    return (
        <li>
            <div 
                className={`docs-item ${isSelected ? 'active' : ''}`}
                onClick={handleClick}
                style={{ paddingLeft: `${depth * 20}px` }}
            >
                <span className="docs-item-icon">
                    {item.type === 'folder' ? '📁' : '📄'}
                </span>
                <span>{item.name}</span>
            </div>
            
            {item.type === 'folder' && item.children && (
                <ul className="docs-nested-list">
                    {item.children.map(child => (
                        <FileTreeItem
                            key={child.path || child.name}
                            item={child}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                            depth={depth + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default FileTreeItem;
