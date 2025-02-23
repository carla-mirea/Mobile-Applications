const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server is running on ws://localhost:8080");
});

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('[WebSocket] Client connected.');

  ws.on('message', (message) => {
    console.log(`[WebSocket] Message received: ${message}`);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('[WebSocket] Client disconnected.');
  });
});

function broadcast(data) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

module.exports = { wss, broadcast };
