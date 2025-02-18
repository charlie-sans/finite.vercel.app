import { useState, useCallback, useEffect } from 'react';

const FileTreeItem = ({ item, selectedFile, onSelect, depth = 0, onCreateFile, onSave }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState(null);
    const isFolder = item.type === 'folder';
    const isSelected = selectedFile?.path === item.path;

    // Add click outside listener
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Close context menu when clicking outside
            if (contextMenuPos) {
                setContextMenuPos(null);
            }
        };

        if (contextMenuPos) {
            document.addEventListener('click', handleClickOutside);
            // Also close on right click anywhere
            document.addEventListener('contextmenu', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
                document.removeEventListener('contextmenu', handleClickOutside);
            };
        }
    }, [contextMenuPos]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Close any existing context menu first
        setContextMenuPos(null);
        // Set new position on next tick to ensure clean state
        setTimeout(() => {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
        }, 0);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (isFolder) {
            setIsCollapsed(!isCollapsed);
        } else {
            onSelect(item);
        }
    };

    const getFileIcon = (filename) => {
        if (!filename) return '📄';
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'md':
                return '📝';
            case 'json':
                return '📊';
            case 'js':
            case 'jsx':
                return '⚛️';
            case 'ts':
            case 'tsx':
                return '📘';
            case 'css':
            case 'scss':
            case 'sass':
                return '🎨';
            case 'html':
            case 'htm':
                return '🌐';
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
            case 'webp':
                return '🖼️';
            case 'pdf':
                return '📑';
            case 'yml':
            case 'yaml':
                return '⚙️';
            case 'xml':
                return '📰';
            case 'sh':
            case 'bash':
                return '💻';
            case 'meta':
                return '📋';
            case 'zip':
            case 'rar':
            case '7z':
                return '📦';
            case 'mp3':
            case 'wav':
            case 'ogg':
                return '🎵';
            case 'mp4':
            case 'avi':
            case 'mov':
                return '🎬';
            default:
                return item.type === 'folder' ? '📁' : '📄';
        }
    };

    return (
        <div style={{ marginLeft: `${depth * 16}px` }}>
            <div 
                className={`editor-tree-item ${isSelected ? 'active' : ''}`}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                {isFolder && (
                    <span className={`folder-icon ${isCollapsed ? 'collapsed' : ''}`}>
                        ▼
                    </span>
                )}
                <span style={{ marginRight: '8px' }}>
                    {getFileIcon(item.name)}
                </span>
                <span>{item.name}</span>
            </div>

            {contextMenuPos && (
                <div 
                    className="context-menu"
                    style={{
                        position: 'fixed',
                        left: contextMenuPos.x,
                        top: contextMenuPos.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => {
                        onCreateFile();
                        setContextMenuPos(null);
                    }}>New File</button>
                    {!isFolder && (
                        <button onClick={() => {
                            onSave();
                            setContextMenuPos(null);
                        }}>Save</button>
                    )}
                </div>
            )}

            {isFolder && item.children && (
                <div className={`folder-children ${isCollapsed ? 'collapsed' : ''}`}>
                    {item.children.map(child => (
                        <FileTreeItem
                            key={child.path || child.name}
                            item={child}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                            onCreateFile={onCreateFile}
                            onSave={onSave}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileTreeItem;
