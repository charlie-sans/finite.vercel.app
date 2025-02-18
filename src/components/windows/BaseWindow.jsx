import { useRef, useState, useEffect } from 'react';

const BaseWindow = ({ 
    children, 
    title,
    className,
    onClose,
    defaultPosition = { x: 50, y: 50 },
    defaultSize = { width: 800, height: 600 },
    minSize = { width: 300, height: 200 },
    isResizable = true
}) => {
    const windowRef = useRef(null);
    const headerRef = useRef(null);
    const [position, setPosition] = useState(defaultPosition);
    const [size, setSize] = useState(defaultSize);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaximizeState, setPreMaximizeState] = useState(null);

    const handleResize = (e, direction) => {
        if (isMaximized) return;

        const rect = windowRef.current.getBoundingClientRect();
        let newX = position.x;
        let newY = position.y;
        let newWidth = size.width;
        let newHeight = size.height;
        
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        switch (direction) {
            case 'right':
                newWidth = Math.max(minSize.width, size.width + deltaX);
                break;
            case 'bottom':
                newHeight = Math.max(minSize.height, size.height + deltaY);
                break;
            case 'left':
                newWidth = Math.max(minSize.width, size.width - deltaX);
                newX = position.x + deltaX;
                break;
            case 'top':
                newHeight = Math.max(minSize.height, size.height - deltaY);
                newY = position.y + deltaY;
                break;
            case 'top-right':
                newWidth = Math.max(minSize.width, size.width + deltaX);
                newHeight = Math.max(minSize.height, size.height - deltaY);
                newY = position.y + deltaY;
                break;
            case 'bottom-right':
                newWidth = Math.max(minSize.width, size.width + deltaX);
                newHeight = Math.max(minSize.height, size.height + deltaY);
                break;
            case 'bottom-left':
                newWidth = Math.max(minSize.width, size.width - deltaX);
                newHeight = Math.max(minSize.height, size.height + deltaY);
                newX = position.x + deltaX;
                break;
            case 'top-left':
                newWidth = Math.max(minSize.width, size.width - deltaX);
                newHeight = Math.max(minSize.height, size.height - deltaY);
                newX = position.x + deltaX;
                newY = position.y + deltaY;
                break;
        }

        // Constrain to viewport
        const maxX = window.innerWidth - newWidth;
        const maxY = window.innerHeight - 40 - newHeight; // Account for taskbar
        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);

        setPosition({ x: newX, y: newY });
        setSize({ width: newWidth, height: newHeight });
        setResizeStart({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                const maxX = window.innerWidth - windowRef.current.offsetWidth;
                const maxY = window.innerHeight - windowRef.current.offsetHeight;
                
                setPosition({
                    x: Math.min(Math.max(0, newX), maxX),
                    y: Math.min(Math.max(0, newY), maxY)
                });
            }
            
            if (isResizing.active) {
                handleResize(e, isResizing.direction);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, size, resizeStart, minSize.width, minSize.height]);

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

    const handleResizeStart = (e) => {
        e.preventDefault();
        setIsResizing(true);
        setResizeStart({ x: e.clientX, y: e.clientY });
    };

    const handleMaximize = () => {
        if (!isMaximized) {
            // Store current state before maximizing
            setPreMaximizeState({ position, size });
            
            // Maximize to fill the viewport
            setPosition({ x: 0, y: 0 });
            setSize({
                width: window.innerWidth,
                height: window.innerHeight - 40 // Account for taskbar height
            });
            setIsMaximized(true);
        } else {
            // Restore previous state
            if (preMaximizeState) {
                setPosition(preMaximizeState.position);
                setSize(preMaximizeState.size);
            }
            setIsMaximized(false);
        }
    };

    // Add resize handlers for each edge/corner
    const startResize = (e, direction) => {
        e.preventDefault();
        if (isMaximized) return;
        
        setIsResizing({ active: true, direction });
        setResizeStart({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            ref={windowRef}
            className={`window ${className} ${isMaximized ? 'maximized' : ''}`}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                '--window-width': `${size.width}px`,
                '--window-height': `${size.height}px`,
                '--window-min-width': `${minSize.width}px`,
                '--window-min-height': `${minSize.height}px`,
                transform: 'none',
                margin: 0,
                transition: isResizing ? 'none' : 'all 0.1s ease',
                maxWidth: '100vw',
                maxHeight: 'calc(100vh - 40px)', // Account for taskbar
            }}
            onMouseDown={handleMouseDown}
        >
            <div ref={headerRef} className="window-header">
                <h2>{title}</h2>
                <div className="window-controls">
                    {isResizable && (
                        <button 
                            className="window-control-btn maximize"
                            onClick={handleMaximize}
                        >
                            {isMaximized ? '❐' : '□'}
                        </button>
                    )}
                    {onClose && (
                        <button 
                            className="window-control-btn close"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            
            <div className="window-content">
                {children}
            </div>
            
            {isResizable && !isMaximized && (
                <>
                    <div className="resize-handle top" onMouseDown={e => startResize(e, 'top')} />
                    <div className="resize-handle right" onMouseDown={e => startResize(e, 'right')} />
                    <div className="resize-handle bottom" onMouseDown={e => startResize(e, 'bottom')} />
                    <div className="resize-handle left" onMouseDown={e => startResize(e, 'left')} />
                    <div className="resize-handle top-left" onMouseDown={e => startResize(e, 'top-left')} />
                    <div className="resize-handle top-right" onMouseDown={e => startResize(e, 'top-right')} />
                    <div className="resize-handle bottom-left" onMouseDown={e => startResize(e, 'bottom-left')} />
                    <div className="resize-handle bottom-right" onMouseDown={e => startResize(e, 'bottom-right')} />
                </>
            )}
        </div>
    );
};

export default BaseWindow;
