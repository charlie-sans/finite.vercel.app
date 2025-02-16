import { useState } from 'react'

const FileTreeItem = ({ item, depth = 0, selectedFile, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = item.type === 'folder';
    const isLast = item.isLast;

    const getPrefix = (depth) => {
        return Array(depth).fill('│  ').join('');
    };

    const getFolderIcon = (isOpen) => {
        return isOpen ? '▼' : '▶';
    };

    const getFileIcon = () => {
        return '📄';
    };

    return (
        <>
            <li 
                className={`docs-item ${
                    !isFolder && selectedFile?.path === item.path ? 'active' : ''
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFolder) {
                        setIsOpen(!isOpen);
                    } else {
                        onSelect(item);
                    }
                }}
            >
                <div className="tree-line">
                    <span className="tree-prefix">{getPrefix(depth)}</span>
                    <span className="tree-branch">{isLast ? '└─' : '├─'}</span>
                    <span className="tree-icon">
                        {isFolder ? getFolderIcon(isOpen) : getFileIcon()}
                    </span>
                    <span className="tree-name">{item.name}</span>
                </div>
            </li>
            {isFolder && isOpen && (
                <ul className="docs-nested-list">
                    {item.children.map((child, index) => (
                        <FileTreeItem
                            key={child.path || child.name}
                            item={{
                                ...child,
                                isLast: index === item.children.length - 1
                            }}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};

export default FileTreeItem;
