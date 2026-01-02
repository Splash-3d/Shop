// Vercel serverless function - simplified approach
const fs = require('fs');
const path = require('path');

// Handle static files and API
module.exports = (req, res) => {
    const url = req.url;
    const method = req.method;
    
    // Handle API routes
    if (url.startsWith('/api/')) {
        // Load and execute the API logic
        try {
            const apiHandler = require('./api/index.js');
            return apiHandler(req, res);
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    // Handle static files
    const filePath = path.join(__dirname, '..', url === '/' ? 'index.html' : url.slice(1));
    
    // Security check - prevent directory traversal
    if (filePath.includes('..')) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        }[ext] || 'text/plain';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return fs.createReadStream(filePath).pipe(res);
    }
    
    // Default to index.html for SPA routes
    const indexPath = path.join(__dirname, '..', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return fs.createReadStream(indexPath).pipe(res);
    }
    
    // File not found
    return res.status(404).json({ error: 'Not Found' });
};
