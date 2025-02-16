import BaseWindow from './BaseWindow';

const EditorWindow = ({ onClose, children }) => {
    return (
        <BaseWindow
            title="Editor"
            className="dev-editor"
            onClose={onClose}
            defaultPosition={{ x: 100, y: 50 }}
            defaultSize={{ width: 1400, height: 900 }}
            minSize={{ width: 800, height: 600 }}
        >
            <div className="editor-layout">
                <div className="editor-sidebar">
                    {children[0]}
                </div>
                <div className="editor-main">
                    {children[1]}
                </div>
            </div>
        </BaseWindow>
    );
};

export default EditorWindow;
