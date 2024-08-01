const express = require('express');
const http = require('http');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');
const articlesRoutes = require('./routes/articles');
const { setupWebSocket } = require('./services/websocket');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = setupWebSocket(server);

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.wss = wss;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/articles', articlesRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

server.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});