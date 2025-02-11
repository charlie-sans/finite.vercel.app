import Markdown from 'react-markdown'
import { useEffect, useState } from 'react'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import '../styles/documentation.css'

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

const documentationFiles = [
    {
        name: 'Getting Started',
        type: 'file',
        path: 'README.md',
        notes: 'Any file you open that has a note or set of notes will display here.'
    },
    {
        name: 'Documentation',
        type: 'folder',
        children: [
            {
                name: 'V1 Instructions',
                type: 'file',
                path: 'spec/v1instructions.md',
                notes_path: 'spec/v1instructions_notes.md'
            },
            {
                name: 'Spec',
                type: 'folder',
                children: [
                    {
                        name: 'Micro Assembly basics',
                        type: 'file',
                        path: 'spec/MASMBasics.md',
                        notes_path: 'spec/MASMBasics_notes.md'
                    }
                ]
            }
        ]
    }
]

const FileTreeItem = ({ item, depth = 0, selectedFile, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = item.type === 'folder';

    return (
        <>
            <li 
                className={`docs-item ${
                    !isFolder && selectedFile?.path === item.path ? 'active' : ''
                }`}
                style={{ paddingLeft: `${depth + 1}rem` }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFolder) {
                        setIsOpen(!isOpen);
                    } else {
                        onSelect(item);
                    }
                }}
            >
                <span className="docs-item-icon">
                    {isFolder ? (isOpen ? '📂' : '📁') : '📄'}
                </span>
                {item.name}
            </li>
            {isFolder && isOpen && (
                <ul className="docs-nested-list">
                    {item.children.map((child) => (
                        <FileTreeItem
                            key={child.path || child.name}
                            item={child}
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

const Documentation = ({ link }) => {
    const [markdown, setMarkdown] = useState('')

    useEffect(() => {
        const fetchAndCacheDoc = async () => {
            // Try to get from cache first
            const cached = getCachedDoc(link)
            if (cached) {
                setMarkdown(cached)
                return
            }

            // If not in cache, fetch from API
            const start_link = "https://git.gay/api/v1/repos/finite/MicroASM/contents/"
            try {
                const res = await fetch(start_link + link)
                const data = await res.json()
                const content = atob(data.content)
                
                // Cache the content
                setCachedDoc(link, content)
                setMarkdown(content)
            } catch (error) {
                console.error('Error fetching documentation:', error)
            }
        }

        fetchAndCacheDoc()
    }, [link])

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

const Masm_Docs = () => {
    const [selectedFile, setSelectedFile] = useState(documentationFiles.find(item => item.type === 'file'));

    return (
        <div className="docs-container">
            <div className="docs-sidebar">
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
            <div className="docs-notes">
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
    )
}

export default Masm_Docs