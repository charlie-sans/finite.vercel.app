import { useState, useEffect, useCallback } from 'react';
import { getFileTree, checkServerStatus } from '../../api/docs';

const FileExplorer = ({ onFileSelect }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState(new Set(['docs'])); // Start with docs folder expanded
    const [error, setError] = useState(null);
    const [serverAvailable, setServerAvailable] = useState(false);

    useEffect(() => {
        checkServerStatus().then(available => {
            setServerAvailable(available);
        });
    }, []);

    const loadFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const tree = await getFileTree();
            if (tree) {
                // Ensure we have a root docs folder
                const docsTree = {
                    name: 'docs',
                    type: 'folder',
                    children: tree
                };
                setFiles([docsTree]);
            }
        } catch (error) {
            console.error('Failed to load files:', error);
            setError('Failed to load files. Server may be offline.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const toggleFolder = (folderPath) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderPath)) {
                next.delete(folderPath);
            } else {
                next.add(folderPath);
            }
            return next;
        });
    };

    const renderItem = (item, depth = 0) => {
        const paddingLeft = `${depth * 16}px`;
        const itemPath = item.path || item.name;
        const isExpanded = expandedFolders.has(itemPath);
        
        return (
            <div key={itemPath}>
                <div 
                    className={`file-explorer-item ${item.type}`}
                    style={{ paddingLeft }}
                    onClick={() => {
                        if (item.type === 'folder') {
                            toggleFolder(itemPath);
                        } else {
                            onFileSelect(item);
                        }
                    }}
                >
                    {item.type === 'folder' ? (
                        <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
                    ) : (
                        <span className="file-icon">📄</span>
                    )}
                    {item.name}
                </div>
                {item.type === 'folder' && isExpanded && item.children?.map(child => 
                    renderItem(child, depth + 1)
                )}
            </div>
        );
    };

    return (
        <div className="file-explorer">
            <div className="file-explorer-header">
                <h3>Files {!serverAvailable && '(Offline)'}</h3>
                <button 
                    onClick={loadFiles} 
                    title={serverAvailable ? 'Refresh files' : 'Server offline'}
                >
                    {serverAvailable ? '🔄' : '⚠️'}
                </button>
            </div>
            <div className="file-explorer-content">
                {loading ? (
                    <div className="loading">Loading files...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : files.length === 0 ? (
                    <div className="no-files">No files found</div>
                ) : (
                    files.map(item => renderItem(item))
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
