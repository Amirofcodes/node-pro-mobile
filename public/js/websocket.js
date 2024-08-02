import { token } from './auth.js';
import { updateArticleList, updateArticleInList, removeArticleFromList } from './articles.js';

let socket;

export function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}?token=${token}`);

  socket.onopen = () => {
    console.log('WebSocket connecté');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket déconnecté', event.code, event.reason);
    if (event.code === 1008) {
      // Token invalid, logout the user
      logout();
    }
  };

  // Setup ping-pong to keep the connection alive
  setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 25000);
}

function handleWebSocketMessage(data) {
  switch (data.type) {
    case 'newArticle':
      updateArticleList(data.data);
      break;
    case 'updateArticle':
      updateArticleInList(data.data);
      break;
    case 'deleteArticle':
      removeArticleFromList(data.data.id);
      break;
    // Add other cases here for handling different types of messages
  }
}