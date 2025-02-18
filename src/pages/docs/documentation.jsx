import Markdown from 'react-markdown'
import { useEffect, useState, useRef, useCallback } from 'react'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import FileTreeItem from '../../components/docs/FileTreeItem'
import DocMetadata from '../../components/docs/DocMetadata'
import '../../styles/documentation.css'
import documentationFiles from './data'
import { calculateReadingTime } from '../../utils/readingTime'
import Taskbar from '../../components/docs/Taskbar'
import MonacoEditor from '../../components/docs/MonacoEditor'
import { getFileTree } from '../../api/docs'
import { useParams, useNavigate } from 'react-router-dom'
import BaseWindow from '../../components/windows/BaseWindow';
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
            {dynamicMetadata && <DocMetadata metadata={dynamicMetadata} />}
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
                                customStyle={{
                                    margin: '1rem 0',
                                    borderRadius: '6px',
                                    maxWidth: '100%'
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                    img({node, ...props}) {
                        return <img style={{ maxWidth: '100%', height: 'auto' }} {...props} />
                    }
                }}
            >
                {markdown}
            </Markdown>
        </div>
    )
}

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
            // Update URL without navigation
            window.history.pushState({}, '', `/docs/${file.path}`);
            setSelectedFile(file);
            
            // Ensure main window is open when selecting a file
            setWindows(prev => ({
                ...prev,
                main: true
            }));
        }
    };

    // Update initial file selection
    useEffect(() => {
        const currentPath = window.location.pathname.replace('/docs/', '');
        if (currentPath) {
            const file = findFileInTree(fileTree, currentPath);
            if (file) {
                setSelectedFile(file);
                setWindows(prev => ({
                    ...prev,
                    main: true
                }));
            }
        }
    }, [fileTree]);

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
                    <BaseWindow
                        title="Documentation"
                        className="terminal-sidebar"
                        defaultPosition={{ x: 20, y: 20 }}
                        defaultSize={{ width: 350, height: 600 }}
                        minSize={{ width: 250, height: 200 }}
                    >
                        <div className="editor-tree-container">
                            {fileTree.map(item => (
                                <FileTreeItem
                                    key={item.path || item.name}
                                    item={item}
                                    selectedFile={selectedFile}
                                    onSelect={handleFileSelect}
                                />
                            ))}
                        </div>
                    </BaseWindow>
                )}
                
                {windows.main && (
                    <BaseWindow
                        title={selectedFile?.name || 'Documentation'}
                        className="terminal-main-window"
                        defaultPosition={{ x: 400, y: 20 }}
                        defaultSize={{ width: 800, height: 600 }}
                        minSize={{ width: 400, height: 300 }}
                    >
                        <div className="terminal-main">
                            {selectedFile && (
                                <Documentation 
                                    link={selectedFile.path}
                                    metadata={selectedFile.metadata}
                                />
                            )}
                        </div>
                    </BaseWindow>
                )}
                
                {windows.notes && (
                    <BaseWindow
                        title="Notes"
                        className="terminal-notes"
                        defaultPosition={{ x: window.innerWidth - 370, y: 20 }}
                        defaultSize={{ width: 350, height: 500 }}
                        minSize={{ width: 250, height: 200 }}
                    >
                        {selectedFile && (selectedFile.notes_path || selectedFile.notes) ? (
                            selectedFile.notes_path ? (
                                <Documentation link={selectedFile.notes_path} />
                            ) : (
                                <div>{selectedFile.notes}</div>
                            )
                        ) : (
                            <p>No notes available for this file</p>
                        )}
                    </BaseWindow>
                )}

                {windows.metadata && (
                    <BaseWindow
                        title="Metadata"
                        className="terminal-metadata"
                        defaultPosition={{ x: window.innerWidth - 370, y: 540 }}
                        defaultSize={{ width: 350, height: 400 }}
                        minSize={{ width: 250, height: 200 }}
                    >
                        {selectedFile && <DocMetadata metadata={selectedFile.metadata} />}
                    </BaseWindow>
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