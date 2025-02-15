import Markdown from 'react-markdown'
import { useEffect, useState } from 'react'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import '../../styles/documentation.css'
import documentationFiles from './data'
const CACHE_PREFIX = 'docs_cache_'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

const getCachedDoc = (path) => {
    const cached = localStorage.getItem(CACHE_PREFIX + path)
    if (!cached) return null

    const { content, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_PREFIX + path)
        return null
    }
    return content
}

const setCachedDoc = (path, content) => {
    const cacheData = {
        content,
        timestamp: Date.now()
    }
    localStorage.setItem(CACHE_PREFIX + path, JSON.stringify(cacheData))
}



const FileTreeItem = ({ item, depth = 0, selectedFile, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = item.type === 'folder';

    return (
        <>
            <li 
                className={`docs-item ${
                    !isFolder && selectedFile?.path === item.path ? 'active' : ''
                }`}
                style={{ paddingLeft: `${depth + 1}rem`, position: 'relative' }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFolder) {
                        setIsOpen(!isOpen);
                    } else {
                        onSelect(item);
                    }
                }}
            >
                {depth > 0 && (
                    <>
                        <span
                            style={{
                                position: 'absolute',
                                left: `${depth}rem`,
                                top: '0',
                                bottom: '50%',
                                borderLeft: '1px solid #d4d4d8',
                                zIndex: 1
                            }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                left: `${depth}rem`,
                                top: '50%',
                                width: '0.75rem',
                                borderTop: '1px solid #d4d4d8',
                                zIndex: 1
                            }}
                        />
                    </>
                )}
                <span className="docs-item-icon" style={{ fontFamily: 'monospace' }}>
                    {isFolder ? (isOpen ? '[-]' : '[+]') : '[ ]'}
                </span>
                {item.name}
                {depth > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            left: `${depth}rem`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderLeft: '1px solid #d4d4d8',
                            height: '100%',
                            zIndex: -20 /* Change this line */
                        }}
                    />
                )}
            </li>
            {isFolder && isOpen && (
                <ul className="docs-nested-list">
                    {item.children.map((child, index) => (
                        <li key={child.path || child.name} style={{ position: 'relative' }}>
                            {index !== item.children.length - 1 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: `${depth + 1}rem`,
                                        top: '0',
                                        bottom: '0',
                                        borderLeft: '1px solid #d4d4d8',
                                        zIndex: 1
                                    }}
                                />
                            )}
                            <FileTreeItem
                                item={child}
                                depth={depth + 1}
                                selectedFile={selectedFile}
                                onSelect={onSelect}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

const Documentation = ({ link }) => {
    const [markdown, setMarkdown] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAndCacheDoc = async () => {
            setError(null)
            
            const cached = getCachedDoc(link)
            if (cached) {
                setMarkdown(cached)
                return
            }

            // Use process.env.PUBLIC_URL for proper public path resolution
            const start_link = `${process.env.PUBLIC_URL || ''}/docs/`
            const fullPath = start_link + link
            
            try {
                console.log('Fetching document from:', fullPath)
                const res = await fetch(fullPath)
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                }
                
                const content = await res.text()
                console.log('Document fetched successfully, length:', content.length)
                
                setCachedDoc(link, content)
                setMarkdown(content)
            } catch (error) {
                console.error('Error fetching documentation:', error)
                setError(`Failed to load document: ${error.message}`)
                setMarkdown('')
            }
        }

        fetchAndCacheDoc()
    }, [link])

    if (error) {
        return <div className="documentation error">{error}</div>
    }

    return (
        <div className='documentation'>
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

const Docs = () => {
    const [selectedFile, setSelectedFile] = useState(documentationFiles.find(item => item.type === 'file'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);

    return (
        <>
            <button 
                className="sidebar-toggle left"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Toggle Documentation"
            >
                {sidebarOpen ? '┃' : '┃'}
            </button>
            
            <button 
                className="sidebar-toggle right"
                onClick={() => setNotesOpen(!notesOpen)}
                title="Toggle Notes"
            >
                {notesOpen ? '┃' : '┃'}
            </button>

            <div className="docs-container">
                <div className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <h2>Documentation</h2>
                    <ul className="docs-list">
                        {documentationFiles.map((item) => (
                            <FileTreeItem
                                key={item.path || item.name}
                                item={item}
                                selectedFile={selectedFile}
                                onSelect={setSelectedFile}
                            />
                        ))}
                    </ul>
                </div>
                
                <div className="docs-content">
                    {selectedFile && <Documentation link={selectedFile.path} />}
                </div>
                
                <div className={`docs-notes ${notesOpen ? 'open' : ''}`}>
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
                </div>
            </div>
        </>
    );
}

export default Docs