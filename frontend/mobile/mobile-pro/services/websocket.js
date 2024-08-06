import config from '../config/config';

let ws = null;
let reconnectInterval = null;
let token = null;

export const connectWebSocket = (authToken) => {
  token = authToken;
  if (!token) {
    console.log('No token available, skipping WebSocket connection');
    return;
  }

  if (ws) {
    ws.close();
  }

  const wsUrl = `${config.WS_URL}?token=${token}`;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
    clearInterval(reconnectInterval);
  };

  ws.onclose = (e) => {
    console.log('WebSocket disconnected:', e.reason);
    scheduleReconnection();
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};

const scheduleReconnection = () => {
  if (!reconnectInterval) {
    reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect WebSocket...');
      connectWebSocket(token);
    }, 5000);
  }
};

export const disconnectWebSocket = () => {
  if (ws) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
    ws.close();
    ws = null;
  }
  token = null;
};

export const getWebSocket = () => ws;

export const isConnected = () => ws && ws.readyState === WebSocket.OPEN;