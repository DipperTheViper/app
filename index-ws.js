const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the HTTP server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});

// WebSocket server setup
const wss = new WebSocketServer({ server });

// Broadcast function to send messages to all clients
wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log('Clients connected:', numClients);

    // Broadcast the current number of clients to all connected clients
    wss.broadcast(`Current visitors: ${numClients}`);

    // Send a welcome message to the newly connected client
    ws.send('Welcome to my server!');

    // Handle client disconnection
    ws.on('close', () => {
        const numClients = wss.clients.size;
        console.log('A client has disconnected. Clients connected:', numClients);

        // Broadcast the updated number of clients after disconnection
        wss.broadcast(`Current visitors: ${numClients}`);
    });
});