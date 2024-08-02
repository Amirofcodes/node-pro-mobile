const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');
const articlesRoutes = require('./routes/articles');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/articles', articlesRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', (ws, req) => {
  const token = req.url.split('=')[1];  // Assuming token is passed as a query parameter

  if (!token) {
    ws.close(1008, 'Token not provided');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      ws.close(1008, 'Invalid token');
      return;
    }

    ws.userId = decoded.user.id;
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      console.log('Received message:', message);
      // Handle incoming messages here
    });
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = { app, wss };