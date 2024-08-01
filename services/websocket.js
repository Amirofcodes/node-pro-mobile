const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);
      // Handle incoming messages
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}

function broadcastUpdate(wss, updateType, data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: updateType, data }));
    }
  });
}

module.exports = { setupWebSocket, broadcastUpdate };