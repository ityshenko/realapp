const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '.') });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // API routes
  if (process.env.NODE_ENV === 'production') {
    process.chdir(path.join(__dirname, 'backend'));
    const apiApp = require('./backend/index.js');
    server.use('/api', apiApp);
  }
  
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://0.0.0.0:${PORT}`);
  });
});
