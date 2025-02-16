const DocMetadata = ({ metadata }) => {
    if (!metadata) return null;

    const generateHeaderArt = (metadata) => {
        const lines = [];
        const borderWidth = 45;
        
        // Top border with title
        lines.push('┌' + '─'.repeat(borderWidth - 2) + '┐');
        const title = 'Document Metadata';
        const titlePadding = Math.floor((borderWidth - title.length - 2) / 2);
        lines.push('│' + ' '.repeat(titlePadding) + title + ' '.repeat(borderWidth - title.length - titlePadding - 2) + '│');
        
        // Separator
        lines.push('├' + '─'.repeat(borderWidth - 2) + '┤');
        
        // Format and add metadata entries
        Object.entries(metadata).forEach(([key, value]) => {
            // Special formatting for arrays (like tags)
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            
            // Split long lines if needed
            const fullLine = `${key}: ${displayValue}`;
            if (fullLine.length > borderWidth - 4) {
                const truncated = fullLine.slice(0, borderWidth - 7) + '...';
                lines.push('│ ' + truncated + ' '.repeat(borderWidth - truncated.length - 3) + '│');
            } else {
                lines.push('│ ' + fullLine + ' '.repeat(borderWidth - fullLine.length - 3) + '│');
            }
        });
        
        // Bottom border
        lines.push('└' + '─'.repeat(borderWidth - 2) + '┘');
        
        return lines.join('\n');
    };

    return (
        <div className="doc-metadata">
            <pre className="doc-metadata-header">
                {generateHeaderArt(metadata)}
            </pre>
        </div>
    );
};

export default DocMetadata;
