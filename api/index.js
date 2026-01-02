// Vercel serverless function
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Importar todas las dependencias necesarias
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Importar y configurar multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF)'), false);
        }
        cb(null, true);
    }
});

// Database simulation
let database = {
    users: [
        {
            id: 1,
            username: process.env.ADMIN_USERNAME || 'admin',
            passwordHash: process.env.ADMIN_PASSWORD_HASH || crypto.createHash('sha256').update('admin123').digest('hex'),
            role: 'admin'
        },
        {
            id: 2,
            username: 'Óscar',
            passwordHash: 'd66a93e05da92d10ddaf5c55b93f3769613713cc5e3d581c1c6befcbf7cdb16f',
            role: 'admin'
        }
    ],
    products: [],
    orders: [],
    stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0.00,
        totalCustomers: 0
    },
    activityLog: []
};

// Session management
const sessions = new Map();

// Helper functions
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

function authenticateUser(username, password) {
    const passwordHash = hashPassword(password);
    const user = database.users.find(u => u.username === username && u.passwordHash === passwordHash);
    return user || null;
}

function validateSession(token) {
    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
        sessions.delete(token);
        return null;
    }
    return session.user;
}

function getTokenFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
    }
    return authHeader;
}

// API Routes
app.get('/api/products', (req, res) => {
    const activeProducts = database.products.filter(p => p.status === 'active');
    res.json(activeProducts);
});

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);
    if (user) {
        const token = generateSessionToken();
        const session = {
            user: { id: user.id, username: user.username, role: user.role },
            token: token,
            createdAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };
        sessions.set(token, session);
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
});

// API Routes - All admin routes require authentication
app.get('/api/admin/verify', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).json({ valid: false });
    }
    const session = validateSession(token);
    if (session) {
        res.json({ valid: true, user: session });
    } else {
        res.status(401).json({ valid: false });
    }
});

app.get('/api/admin/stats', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    database.stats.totalProducts = database.products.filter(p => p.status === 'active').length;
    res.json(database.stats);
});

app.get('/api/admin/activity', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    const activity = database.activityLog.slice(-20).reverse();
    res.json(activity);
});

app.get('/api/admin/popular-products', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    const popularProducts = database.products
        .filter(p => p.status === 'active')
        .slice(0, 3)
        .map(p => ({
            name: p.name,
            sales: p.sales || 0
        }));
    res.json(popularProducts);
});

app.post('/api/admin/products', upload.single('productImage'), (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const newId = database.products.length > 0
        ? Math.max(...database.products.map(p => p.id)) + 1
        : 1;

    let imagePath = null;
    if (req.file) {
        imagePath = `/uploads/products/${req.file.filename}`;
    }

    const newProduct = {
        id: newId,
        sales: 0,
        ...req.body,
        image: imagePath,
        createdAt: new Date().toISOString()
    };

    database.products.push(newProduct);
    database.stats.totalProducts = database.products.filter(p => p.status === 'active').length;

    database.activityLog.push({
        product: newProduct.name,
        action: 'Añadido',
        date: new Date().toISOString()
    });

    console.log(`Product created: ${newProduct.name}`);
    if (imagePath) {
        console.log(`Image uploaded: ${imagePath}`);
    }

    res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const productId = parseInt(req.params.id, 10);
    const productIndex = database.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    database.products[productIndex] = {
        ...database.products[productIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    const updatedProduct = database.products[productIndex];

    database.activityLog.push({
        product: updatedProduct.name,
        action: 'Actualizado',
        date: new Date().toISOString()
    });

    console.log(`Product updated: ${updatedProduct.name}`);

    res.json({ success: true, product: updatedProduct });
});

app.delete('/api/admin/products/:id', (req, res) => {
    const token = getTokenFromHeader(req);
    if (!validateSession(token)) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const productId = parseInt(req.params.id, 10);
    const productIndex = database.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const deletedProduct = database.products[productIndex];

    database.products.splice(productIndex, 1);
    database.stats.totalProducts = database.products.filter(p => p.status === 'active').length;

    database.activityLog.push({
        product: deletedProduct.name,
        action: 'Eliminado',
        date: new Date().toISOString()
    });

    console.log(`Product deleted: ${deletedProduct.name}`);

    res.json({ success: true });
});

app.post('/api/admin/logout', (req, res) => {
    const token = getTokenFromHeader(req);
    if (token) {
        sessions.delete(token);
    }
    res.json({ success: true });
});

// Serve static files for all other routes
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, '..', req.path);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
});

// Exportar para Vercel
module.exports = app;
