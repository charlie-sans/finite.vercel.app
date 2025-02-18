const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.REACT_APP_API_URL;

export const saveDocument = async (filePath, content, metadata) => {
    try {
        const response = await fetch(`${API_URL}/api/docs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: filePath,
                content,
                metadata: {
                    ...metadata,
                    lastUpdated: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to save document:', error);
        return { success: false, error: error.message };
    }
};

export const getFileTree = async () => {
    try {
        // Try to connect to dev server
        const response = await fetch(`${API_URL}/api/docs/tree`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Dev server not available, falling back to static data:', error);
        // Fallback to static data if server is not available
        return [{
            name: 'docs',
            type: 'folder',
            children: [
                {
                    name: 'README.md',
                    type: 'file',
                    path: 'README.md',
                    metadata: { author: 'Developer', lastUpdated: new Date().toISOString() }
                }
            ]
        }];
    }
};

export const getDocument = async (path) => {
    try {
        const response = await fetch(`${API_URL}/api/docs/${path}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch document:', error);
        return null;
    }
};

// For development, also provide a mock implementation
export const mockSaveDocument = async (filePath, content, metadata) => {
    console.log('Mock saving document:', { filePath, content, metadata });
    // Store in localStorage instead
    try {
        localStorage.setItem(`docs_dev_${filePath}`, JSON.stringify({
            content,
            metadata: {
                ...metadata,
                lastUpdated: new Date().toISOString()
            }
        }));
        return { success: true };
    } catch (error) {
        console.error('Failed to save to filesystem:', error);
        return { success: false, error: error.message };
    }
};

// Add server status check
export const checkServerStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        console.warn('Dev server not available:', error);
        return false;
    }
};

// Update useMockApi to be dynamic based on server availability
export let useMockApi = true;

// Auto-detect if we should use mock API
checkServerStatus().then(available => {
    useMockApi = !available;
    console.log(`Using ${useMockApi ? 'mock' : 'real'} API`);
});

// Add function to refresh file tree after save
export const refreshFileTree = async () => {
    if (!API_URL) return null;
    try {
        const response = await fetch(`${API_URL}/api/docs/tree`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to refresh file tree:', error);
        return null;
    }
};

export const loadDocument = async (path) => {
    try {
        const response = await fetch(`${API_URL}/api/docs/${path}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to load document:', error);
        return null;
    }
};
