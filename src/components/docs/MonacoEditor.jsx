import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { loadDocument, saveDocument } from '../../api/docs';
import EditorWindow from '../windows/EditorWindow';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
                            <span style={{ width: '16px', textAlign: 'center' }}>
                                {item.type === 'folder' ? '📁' : '📄'}
                            </span>
                            {item.name}
                        </div>
                        {item.children && renderTree(item.children, depth + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <EditorWindow onClose={onClose}>
            <div className="editor-tree">
                {renderTree(files)}
            </div>
            <div className="editor-workspace">
                <div className="editor-toolbar">
                    {activeFile && (
                        <div className="editor-tabs">
                            {modified ? '● ' : ''}{activeFile.name}
                        </div>
                    )}
                    <div className="editor-controls">
                        <button 
                            onClick={handleSave} 
                            disabled={!modified}
                            className={modified ? 'modified' : ''}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="editor-content-area">
                    <Split 
                        sizes={[70, 30]} 
                        direction="horizontal"
                        className="split-layout"
                    >
                        <div className="monaco-container">
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
                                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    renderWhitespace: 'boundary',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    fixedOverflowWidgets: true
                                }}
                            />
                        </div>
                        <div className="preview-panel">
                            <h3>Preview</h3>
                            <div className="preview-content">
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {content}
                                </Markdown>
                            </div>
                        </div>
                    </Split>
                </div>
            </div>
        </EditorWindow>
    );
};

export default MonacoEditor;
