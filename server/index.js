require('dotenv').config();

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');

const initializeChatbot = require('./chatbot');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

const server = https.createServer(
  {
    cert: fs.readFileSync(process.env.SSL_CERT),
    key: fs.readFileSync(process.env.SSL_KEY),
  },
  app,
);

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

initializeChatbot(wss);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(8080, () => {
  console.log(`Listening on https://localhost:${server.address().port}`);
});
