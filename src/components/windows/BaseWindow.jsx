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
            
            if (isResizing) {
                const newWidth = Math.max(minSize.width, size.width + (e.clientX - resizeStart.x));
                const newHeight = Math.max(minSize.height, size.height + (e.clientY - resizeStart.y));
                
                setSize({ width: newWidth, height: newHeight });
                setResizeStart({ x: e.clientX, y: e.clientY });
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

    return (
        <div
            ref={windowRef}
            className={`window ${className}`}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height
            }}
            onMouseDown={handleMouseDown}
        >
            <div ref={headerRef} className="window-header">
                <h2>{title}</h2>
                <div className="window-controls">
                    {onClose && <button onClick={onClose}>✕</button>}
                </div>
            </div>
            
            <div className="window-content">
                {children}
            </div>
            
            {isResizable && (
                <div 
                    className="window-resize-handle"
                    onMouseDown={handleResizeStart}
                />
            )}
        </div>
    );
};

export default BaseWindow;
