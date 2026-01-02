// Vercel serverless function
const express = require('express');
const path = require('path');
const fs = require('fs');

// Importar el server original
let server;
try {
  server = require('./server.js');
} catch (error) {
  console.error('Error loading server.js:', error);
}

// Exportar para Vercel
module.exports = (req, res) => {
  // Si hay un servidor Express, usarlo
  if (server && typeof server === 'function') {
    return server(req, res);
  }
  
  // Servir archivos estáticos
  const filePath = path.join(__dirname, req.path);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif'
    }[ext] || 'text/plain';
    
    res.setHeader('Content-Type', contentType);
    return fs.createReadStream(filePath).pipe(res);
  }
  
  // Default response
  res.status(404).json({ error: 'Not Found' });
};
