const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DOCS_DIR = path.join(__dirname, '../public/docs');

// Configure CORS to allow requests from your development server
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.0.150:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await fs.access(DOCS_DIR);
        res.json({ status: 'ok', docsDir: DOCS_DIR });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Get file tree
app.get('/api/docs/tree', async (req, res) => {
    try {
        const tree = await buildFileTree(DOCS_DIR);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get document content
app.get('/api/docs/:path(*)', async (req, res) => {
    try {
        const docPath = path.join(DOCS_DIR, req.params.path);
        const content = await fs.readFile(docPath, 'utf8');
        
        let metadata = {};
        try {
            const metaPath = `${docPath}.meta.json`;
            const metaContent = await fs.readFile(metaPath, 'utf8');
            metadata = JSON.parse(metaContent);
        } catch (err) {
            // Metadata file might not exist
        }

        res.json({ content, metadata });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Save document
app.post('/api/docs', async (req, res) => {
    try {
        const { path: docPath, content, metadata } = req.body;
        const fullPath = path.join(DOCS_DIR, docPath);
        const dir = path.dirname(fullPath);

        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        
        if (metadata) {
            const metaPath = `${fullPath}.meta.json`;
            await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf8');
        }

        res.json({ success: true, path: docPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function buildFileTree(dir) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    const tree = [];

    for (const item of items) {
        if (item.name.startsWith('.') || item.name.endsWith('.meta.json')) continue;

        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(DOCS_DIR, fullPath);
        
        if (item.isDirectory()) {
            const children = await buildFileTree(fullPath);
            tree.push({
                name: item.name,
                type: 'folder',
                children
            });
        } else {
            let metadata = {};
            try {
                const metaPath = `${fullPath}.meta.json`;
                const metaContent = await fs.readFile(metaPath, 'utf8');
                metadata = JSON.parse(metaContent);
            } catch (err) {
                // Metadata file might not exist
            }

            tree.push({
                name: item.name,
                type: 'file',
                path: relativePath,
                metadata
            });
        }
    }

    return tree;
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dev server running on http://localhost:${PORT}`);
    console.log(`Serving docs from: ${DOCS_DIR}`);
});
