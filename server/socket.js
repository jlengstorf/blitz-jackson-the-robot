let socket = false;
let pinger;

const sendMessage = msg => {
  if (!socket) return;

  socket.send(JSON.stringify(msg));
};

const initializeSocket = wss => {
  // listen for a websocket connection and grab it for sending events
  wss.on('connection', ws => {
    // we only want to have one active socket to avoid duplicates
    // this kinda feels like a hack, but it does what I want so #yolo
    socket = ws;

    // if you want to debug, uncomment this and send messages from the client
    socket.on('message', message => {
      console.log(message);
    });

    // set a ping interval to keep the connection alive
    clearInterval(pinger);
    pinger = setInterval(() => {
      sendMessage('ping');
    }, 15000);
  });
};

module.exports = {
  sendMessage,
  initializeSocket,
};
