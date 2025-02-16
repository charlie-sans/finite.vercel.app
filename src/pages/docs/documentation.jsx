import Markdown from 'react-markdown'
import { useEffect, useState, useRef, useCallback } from 'react'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import FileTreeItem from '../../components/docs/FileTree'
import DocMetadata from '../../components/docs/DocMetadata'
import '../../styles/documentation.css'
import documentationFiles from './data'
import { calculateReadingTime } from '../../utils/readingTime'
import Taskbar from '../../components/docs/Taskbar'
import MonacoEditor from '../../components/docs/MonacoEditor'
import { getFileTree } from '../../api/docs'
import { useParams, useNavigate } from 'react-router-dom'
const CACHE_PREFIX = 'docs_cache_'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

const getCachedDoc = (path) => {
    const cached = localStorage.getItem(CACHE_PREFIX + path)
    if (!cached) return null

    const { content, timestamp, metadata } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_PREFIX + path)
        return null
    }
    return { content, metadata }
}

const setCachedDoc = (path, content, metadata) => {
    const cacheData = {
        content,
        metadata,
        timestamp: Date.now()
    }
    localStorage.setItem(CACHE_PREFIX + path, JSON.stringify(cacheData))
}

const Documentation = ({ link, metadata }) => {
    const [markdown, setMarkdown] = useState('')
    const [error, setError] = useState(null)
    const [dynamicMetadata, setDynamicMetadata] = useState(metadata)

    useEffect(() => {
        const fetchAndCacheDoc = async () => {
            setError(null)
            
            const cached = getCachedDoc(link)
            if (cached) {
                setMarkdown(cached.content)
                setDynamicMetadata(cached.metadata)
                return
            }

            const start_link = `${process.env.PUBLIC_URL || ''}/docs/`
            const fullPath = start_link + link
            
            try {
                const res = await fetch(fullPath)
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                
                const content = await res.text()
                const readingTime = calculateReadingTime(content)
                const updatedMetadata = {
                    ...metadata,
                    readingTime,
                    lastFetched: new Date().toISOString()
                }
                
                setMarkdown(content)
                setDynamicMetadata(updatedMetadata)
                setCachedDoc(link, content, updatedMetadata)
                
            } catch (error) {
                setError(`Failed to load document: ${error.message}`)
                setMarkdown('')
            }
        }

        fetchAndCacheDoc()
    }, [link, metadata])

    if (error) {
        return <div className="documentation error">{error}</div>
    }

    return (
        <div className='documentation'>
            <DocMetadata metadata={dynamicMetadata} />
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
                {markdown}
            </Markdown>
        </div>
    )
}

const DraggableWindow = ({ children, className, onClose }) => {
    const windowRef = useRef(null);
    const headerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!initialPosition && windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            setInitialPosition({ x: rect.left, y: rect.top });
            setPosition({ x: rect.left, y: rect.top });
        }
    }, [initialPosition]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && windowRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Prevent dragging outside viewport
                const maxX = window.innerWidth - windowRef.current.offsetWidth;
                const maxY = window.innerHeight - windowRef.current.offsetHeight;
                
                setPosition({
                    x: Math.min(Math.max(0, newX), maxX),
                    y: Math.min(Math.max(0, newY), maxY)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e) => {
        if (headerRef.current?.contains(e.target)) {
            e.preventDefault();
            setIsDragging(true);
            const rect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    return (
        <div
            ref={windowRef}
            className={`mdi-window ${className}`}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                transform: 'none'
            }}
            onMouseDown={handleMouseDown}
        >
            <div ref={headerRef} className="mdi-window-header">
                {children[0]}
            </div>
            <div className="mdi-window-content">
                {children[1]}
            </div>
        </div>
    );
};

const Docs = () => {
    const { path } = useParams();
    const navigate = useNavigate();
    const [windows, setWindows] = useState({
        sidebar: false,
        main: true,
        notes: false,
        metadata: false
    });

    const toggleWindow = (window) => {
        setWindows(prev => ({
            ...prev,
            [window]: !prev[window]
        }));
    };

    const [selectedFile, setSelectedFile] = useState(documentationFiles.find(item => item.type === 'file'));
    const [showDevEditor, setShowDevEditor] = useState(false);
    const isDev = process.env.NODE_ENV === 'development';
    const [fileTree, setFileTree] = useState(documentationFiles);

    useEffect(() => {
        const loadFileTree = async () => {
            if (process.env.NODE_ENV === 'development') {
                const tree = await getFileTree();
                if (tree) setFileTree(tree);
            }
        };

        loadFileTree();
    }, []);

    const handleEditorSave = useCallback((newTree) => {
        setFileTree(newTree);
    }, []);

    const handleFileSelect = (file) => {
        if (file.type === 'file') {
            navigate(`/docs/${file.path}`);
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (path) {
            const file = findFileInTree(fileTree, path);
            if (file) {
                setSelectedFile(file);
            }
        }
    }, [path, fileTree]);

    // Helper function to find file in tree
    const findFileInTree = (tree, path) => {
        for (const item of tree) {
            if (item.type === 'file' && item.path === path) {
                return item;
            }
            if (item.children) {
                const found = findFileInTree(item.children, path);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <div className="desktop-environment">
            <div className="desktop-workspace">
                {windows.sidebar && (
                    <DraggableWindow className="terminal-sidebar">
                        <h2>Documentation</h2>
                        <ul className="docs-list">
                            {fileTree.map((item, index) => (
                                <FileTreeItem
                                    key={item.path || item.name}
                                    item={{
                                        ...item,
                                        isLast: index === fileTree.length - 1
                                    }}
                                    selectedFile={selectedFile}
                                    onSelect={handleFileSelect}
                                />
                            ))}
                        </ul>
                    </DraggableWindow>
                )}
                
                {windows.main && (
                    <DraggableWindow className="terminal-main-window">
                        <h2>{selectedFile?.name || 'Documentation'}</h2>
                        <div className="terminal-main">
                            {selectedFile && (
                                <Documentation 
                                    link={selectedFile.path}
                                    metadata={selectedFile.metadata}
                                />
                            )}
                        </div>
                    </DraggableWindow>
                )}
                
                {windows.notes && (
                    <DraggableWindow className="terminal-notes">
                        <h2>Notes</h2>
                        {selectedFile && (selectedFile.notes_path || selectedFile.notes) ? (
                            selectedFile.notes_path ? (
                                <Documentation link={selectedFile.notes_path} />
                            ) : (
                                <div>{selectedFile.notes}</div>
                            )
                        ) : (
                            <p>No notes available for this file</p>
                        )}
                    </DraggableWindow>
                )}

                {windows.metadata && (
                    <DraggableWindow className="terminal-metadata">
                        <h2>Metadata</h2>
                        {selectedFile && <DocMetadata metadata={selectedFile.metadata} />}
                    </DraggableWindow>
                )}

                {isDev && showDevEditor && (
                    <MonacoEditor 
                        onClose={() => setShowDevEditor(false)}
                        onSave={handleEditorSave}
                    />
                )}
            </div>
            <Taskbar 
                windows={{
                    ...windows,
                    ...(isDev && { devEditor: showDevEditor })
                }}
                toggleWindow={(key) => {
                    if (key === 'devEditor') {
                        setShowDevEditor(!showDevEditor);
                    } else {
                        setWindows(prev => ({
                            ...prev,
                            [key]: !prev[key]
                        }));
                    }
                }}
            />
        </div>
    );
}

export default Docs