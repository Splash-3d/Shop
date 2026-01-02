const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes (tu código existente)
require('./server.js');

// Serve static files for all other routes
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    // Default to index.html for SPA routes
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

module.exports = app;
