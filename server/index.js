require('dotenv').config();

const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const http = require('http');

const initializeChatbot = require('./chatbot');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

initializeChatbot(wss);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
    console.log('sent a connection event');
  });
});

server.listen(8080, () => {
  console.log('Listening on http://localhost:8080');
});
