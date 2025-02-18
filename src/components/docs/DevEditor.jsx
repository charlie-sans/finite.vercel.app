import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { UncontrolledTreeEnvironment, Tree } from 'react-complex-tree';
import 'react-complex-tree/lib/style.css';
import { saveDocument, loadDocument, getFileTree } from '../../api/docs';

const DevEditor = ({ onClose, onSave }) => {
   const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [path, setPath] = useState('');
    const [modified, setModified] = useState(false);
    const [saved, setSaved] = useState(false);
    const windowRef = useRef(null);
    const headerRef = useRef(null);
    const [position, setPosition] = useState({ x: 100, y: 50 });

    const handleContentChange = useCallback((value) => {
        setContent(value || '');
        setModified(true);
        setSaved(false);
    }, []);

    const handleSave = async () => {
        try {
            const fullPath = path ? `${path}/${fileName}.md` : `${fileName}.md`;
            const result = await saveDocument(fullPath, content);
            if (result.success) {
                setModified(false);
                setSaved(true);
                onSave?.(result.data);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save document');
        }
    };

    const handleEditorDidMount = (editor) => {
        editor.focus();
    };

    const [treeData, setTreeData] = useState({
        root: { items: [] },
        items: {}
    });

    // Convert file tree to react-complex-tree format
    const convertToTreeData = (files) => {
        const items = {};
        const processItem = (item) => {
            if (item.type === 'folder') {
                const children = item.children?.map(child => child.path || child.name) || [];
                items[item.name] = {
                    index: item.name,
                    data: item.name,
                    children,
                    canMove: false,
                    hasChildren: children.length > 0
                };
                item.children?.forEach(processItem);
            } else {
                items[item.path] = {
                    index: item.path,
                    data: item.name,
                    filePath: item.path,
                    canMove: false,
                    hasChildren: false
                };
            }
        };

        files.forEach(processItem);
        return {
            root: { items: files.map(f => f.name) },
            items
        };
    };

    useEffect(() => {
        const loadTree = async () => {
            const tree = await getFileTree();
            if (tree) {
                setTreeData(convertToTreeData(tree));
            }
        };
        loadTree();
    }, []);

    const handleFileSelect = async (item) => {
        if (!item.data.filePath) return;

        if (modified) {
            if (!window.confirm('You have unsaved changes. Load new file anyway?')) {
                return;
            }
        }

        try {
            const doc = await loadDocument(item.data.filePath);
            if (doc) {
                setFileName(item.data.data);
                setPath(item.data.filePath.split('/').slice(0, -1).join('/'));
                setContent(doc.content);
                setModified(false);
            }
        } catch (error) {
            console.error('Failed to load file:', error);
            alert('Failed to load file');
        }
    };

    return (
        <div
            ref={windowRef}
            className="mdi-window dev-editor"
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                display: 'flex'
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="editor-sidebar">
                <UncontrolledTreeEnvironment
                    canDragAndDrop={false}
                    canDropOnFolder={false}
                    canReorderItems={false}
                    dataProvider={{
                        getData: () => Promise.resolve(treeData)
                    }}
                    getItemTitle={item => item.data}
                    viewState={{}}
                    onPrimaryAction={item => handleFileSelect(item)}
                >
                    <Tree treeId="files" rootItem="root" />
                </UncontrolledTreeEnvironment>
            </div>

            <div className="editor-main">
                <div ref={headerRef} className="mdi-window-header">
                    <h2>📝 {modified ? '● ' : ''}{fileName || 'Untitled'}.md</h2>
                    <div className="window-controls">
                        <span className="hotkey-hint">⌃S Save</span>
                        <span className="hotkey-hint">⌃B Bold</span>
                        <span className="hotkey-hint">Esc Close</span>
                        <button onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="editor-content">
                    <div className="dev-editor-toolbar">
                        <input
                            type="text"
                            placeholder="File name (without .md)"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Path (optional, e.g., tutorials)"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                        />
                        <button 
                            onClick={handleSave}
                            className={saved ? 'saved' : ''}
                        >
                            {saved ? '✓ Saved' : 'Save'}
                        </button>
                    </div>

                    <div className="monaco-container">
                        <Editor
                            height="60vh"
                            defaultLanguage="markdown"
                            value={content}
                            onChange={handleContentChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                renderWhitespace: 'all',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                            onMount={handleEditorDidMount}
                        />
                    </div>

                    <div className="preview-panel">
                        <h3>Preview</h3>
                        <div className="preview-content markdown-preview">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevEditor;
