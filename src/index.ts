import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const httpServer = app.listen(8080, () => {
  console.log('HTTP server is listening on port 8080');
});

// Create a WebSocket server instance
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  console.log('New client connected');

  // Handle errors
  ws.on('error', console.error);

  // Handle incoming messages
  ws.on('message', function message(data, isBinary) {
    console.log('Received message:', data);

    // Broadcast message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  // Send a welcome message to the newly connected client
  ws.send('Hello! Message From Server!!');
});

app.get('/', (req, res) => {
  res.send('WebSocket server is up and running!');
});
