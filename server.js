const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');
const articlesRoutes = require('./routes/articles');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Make wss available to our routes
app.set('wss', wss);

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/articles', articlesRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    // Handle incoming messages here
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});