const Taskbar = ({ windows, toggleWindow }) => {
    return (
        <div className="desktop-taskbar">
            <div className="taskbar-start">
                <button className="taskbar-button">📂 Finite</button>
            </div>
            <div className="taskbar-windows">
                {Object.entries(windows).map(([key, isOpen]) => (
                    <button
                        key={key}
                        className={`taskbar-button ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleWindow(key)}
                    >
                        {getWindowIcon(key)} {getWindowName(key)}
                    </button>
                ))}
            </div>
            <div className="taskbar-tray">
                <span className="taskbar-time">
                    {new Date().toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

const getWindowIcon = (key) => {
    const icons = {
        sidebar: '📑',
        main: '📄',
        notes: '📝',
        metadata: '📊',
        devEditor: '✏️'
    };
    return icons[key] || '🪟';
};

const getWindowName = (key) => {
    const names = {
        sidebar: 'Files',
        main: 'Document',
        notes: 'Notes',
        metadata: 'Properties',
        devEditor: 'Editor'
    };
    return names[key] || key;
};

export default Taskbar;
