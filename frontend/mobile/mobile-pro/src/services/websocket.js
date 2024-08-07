import config from '../config/config';

let ws = null;
let reconnectInterval = null;
let token = null;
let isConnecting = false;

const MAX_RECONNECT_DELAY = 5000;
let reconnectDelay = 1000;

export const connectWebSocket = (authToken) => {
  if (isConnecting) return;
  isConnecting = true;

  token = authToken;
  if (!token) {
    console.log('No token available, skipping WebSocket connection');
    isConnecting = false;
    return;
  }

  if (ws) {
    ws.close();
  }

  const wsUrl = `${config.WS_URL}?token=${token}`;
  console.log('Connecting to WebSocket:', wsUrl);
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
    isConnecting = false;
    clearInterval(reconnectInterval);
    reconnectDelay = 1000;  // Reset the delay on successful connection
  };

  ws.onclose = (e) => {
    console.log('WebSocket disconnected:', e.code, e.reason);
    isConnecting = false;
    scheduleReconnection();
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    isConnecting = false;
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