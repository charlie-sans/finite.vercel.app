import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { loadDocument, saveDocument } from '../../api/docs';
import BaseWindow from '../windows/BaseWindow';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FileTreeItem from './FileTreeItem';

const MonacoEditor = ({ onClose, onSave }) => {
    const [files, setFiles] = useState([]); // Initialize as empty array
    const [activeFile, setActiveFile] = useState(null);
    const [content, setContent] = useState('');
    const [modified, setModified] = useState(false);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        // Load file tree on mount
        fetch('http://localhost:3001/api/docs/tree')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch file tree');
                return res.json();
            })
            .then(tree => {
                // Ensure tree is an array
                setFiles(Array.isArray(tree) ? tree : []);
            })
            .catch(err => {
                console.error('Error loading file tree:', err);
                setError(err.message);
                setFiles([]); // Ensure files is always an array
            });
    }, []);

    const refreshFileTree = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/docs/tree');
            if (!res.ok) throw new Error('Failed to fetch file tree');
            const tree = await res.json();
            setFiles(Array.isArray(tree) ? tree : []);
        } catch (err) {
            console.error('Error refreshing file tree:', err);
            setError(err.message);
        }
    };

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

    const handleCreateFile = async () => {
        if (!newFileName) return;
        
        try {
            const newFilePath = `/home/charlie/git/finite.vercel.app/public/docs/${newFileName}${newFileName.endsWith('.md') ? '' : '.md'}`;
            await saveDocument(newFilePath, '', {
                lastUpdated: new Date().toISOString()
            });
            setIsCreatingFile(false);
            setNewFileName('');
            await refreshFileTree();
            
            // Select the new file
            const newFile = { path: newFilePath, name: newFileName };
            await handleFileSelect(newFile);
        } catch (error) {
            console.error('Failed to create file:', error);
        }
    };

    const handleSave = async () => {
        if (!activeFile) return;

        try {
            await saveDocument(activeFile.path, content, {
                lastUpdated: new Date().toISOString()
            });
            setModified(false);
            await refreshFileTree(); // Refresh after save
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const generateMetadata = () => {
        if (!activeFile) return;
        
        const basePath = activeFile.path.replace('.md', '.meta');
        const metadata = {
            title: activeFile.name.replace('.md', ''),
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            wordCount: content.split(/\s+/).length,
            readingTime: Math.ceil(content.split(/\s+/).length / 200), // Assuming 200 words per minute
            type: 'documentation',
            status: 'draft',
            tags: [],
            author: 'System'
        };

        saveDocument(basePath, JSON.stringify(metadata, null, 2), {})
            .then(() => {
                alert('Metadata file generated successfully!');
            })
            .catch(error => {
                console.error('Failed to generate metadata:', error);
                alert('Failed to generate metadata file');
            });
    };

    return (
        <BaseWindow
            title="Editor"
            className="dev-editor"
            onClose={onClose}
            defaultPosition={{ x: 100, y: 50 }}
            defaultSize={{ width: 1400, height: 900 }}
            minSize={{ width: 800, height: 600 }}
        >
            <Split
                sizes={[20, 80]}
                minSize={[200, 400]}
                maxSize={[400, Infinity]}
                expandToMin={false}
                gutterSize={4}
                className="editor-layout split-horizontal"
            >
                <div className="editor-sidebar">
                    <div className="editor-tree-container">
                        {error ? (
                            <div className="error-message">{error}</div>
                        ) : (
                            files.map(item => (
                                <FileTreeItem
                                    key={item.path || item.name}
                                    item={item}
                                    selectedFile={activeFile}
                                    onSelect={handleFileSelect}
                                    onCreateFile={() => setIsCreatingFile(true)}
                                    onSave={handleSave}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className="editor-main">
                    <div className="editor-toolbar">
                        <div className="editor-tabs">
                            {activeFile ? (
                                <>{modified ? '● ' : ''}{activeFile.name}</>
                            ) : (
                                isCreatingFile ? (
                                    <div className="new-file-input">
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            placeholder="filename.md"
                                            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                                        />
                                        <button onClick={handleCreateFile}>Create</button>
                                        <button onClick={() => {
                                            setIsCreatingFile(false);
                                            setNewFileName('');
                                        }}>Cancel</button>
                                    </div>
                                ) : (
                                    <button 
                                        className="new-file-btn"
                                        onClick={() => setIsCreatingFile(true)}
                                    >
                                        + New File
                                    </button>
                                )
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
                            {activeFile?.name.endsWith('.md') && (
                                <button 
                                    onClick={generateMetadata}
                                    title="Generate metadata file"
                                    className="metadata-btn"
                                >
                                    📋 Meta
                                </button>
                            )}
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
            </Split>
        </BaseWindow>
    );
};

export default MonacoEditor;
