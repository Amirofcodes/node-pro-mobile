const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set('wss', wss);

const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});