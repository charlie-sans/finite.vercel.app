import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { loadDocument, saveDocument } from '../../api/docs';

const MonacoEditor = ({ onClose, onSave }) => {
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [content, setContent] = useState('');
    const [modified, setModified] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        // Load file tree on mount
        fetch('http://localhost:3001/api/docs/tree')
            .then(res => res.json())
            .then(tree => setFiles(tree));
    }, []);

    const handleFileSelect = async (file) => {
        if (modified && !window.confirm('Discard changes?')) {
            return;
        }

        try {
            const doc = await loadDocument(file.path);
            if (doc) {
                setContent(doc.content);
                setActiveFile(file);
                setModified(false);
            }
        } catch (error) {
            console.error('Failed to load file:', error);
        }
    };

    const handleSave = async () => {
        if (!activeFile) return;

        try {
            await saveDocument(activeFile.path, content, {
                lastUpdated: new Date().toISOString()
            });
            setModified(false);
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const renderTree = (items, depth = 0) => {
        return (
            <div style={{ marginLeft: depth * 12 }}>
                {items.map(item => (
                    <div key={item.path || item.name}>
                        <div
                            className={`editor-tree-item ${item.type} ${activeFile?.path === item.path ? 'active' : ''}`}
                            onClick={() => item.type === 'file' && handleFileSelect(item)}
                        >
                            {item.type === 'folder' ? '📁' : '📄'} {item.name}
                        </div>
                        {item.children && renderTree(item.children, depth + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="monaco-editor-container">
            <div className="editor-header">
                <div className="editor-tabs">
                    {activeFile && (
                        <div className="editor-tab">
                            {modified ? '● ' : ''}{activeFile.name}
                        </div>
                    )}
                </div>
                <div className="editor-controls">
                    <button 
                        onClick={handleSave} 
                        disabled={!modified}
                        className={modified ? 'modified' : ''}
                    >
                        Save
                    </button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
            <Split
                sizes={[20, 80]}
                minSize={100}
                gutterSize={8}
                className="editor-split"
            >
                <div className="editor-sidebar">
                    <div className="editor-tree">
                        {renderTree(files)}
                    </div>
                </div>
                <div className="editor-main">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        defaultLanguage="markdown"
                        value={content}
                        onChange={(value) => {
                            setContent(value || '');
                            setModified(true);
                        }}
                        onMount={(editor) => editorRef.current = editor}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            renderWhitespace: 'boundary',
                            scrollBeyondLastLine: false
                        }}
                    />
                </div>
            </Split>
        </div>
    );
};

export default MonacoEditor;
