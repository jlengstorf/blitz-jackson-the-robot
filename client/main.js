const ws = new WebSocket(`wss://${location.host}`);

// seconds * 1000 to get a timeout
const CMD_COOLDOWN = 30 * 1000;
const container = document.getElementById('app');

const commandsOnTimeOut = new Map();

const handleCommand = msg => {
  // if this command has been called too recently, bail
  if (commandsOnTimeOut.get(msg.name)) {
    return;
  }

  // play audio if the command has any
  if (msg.sfx) {
    const audio = new Audio(msg.sfx);
    audio.play();

    // set a cooldown period to avoid being too noisy
    commandsOnTimeOut.set(msg.name, true);
    setTimeout(() => {
      commandsOnTimeOut.delete(msg.name);
    }, CMD_COOLDOWN);
  }

  // show a GIF if the command has one
  if (msg.gif) {
    const img = document.createElement('img');
    img.classList.add('command-image', 'visible');
    img.src = msg.gif;

    const text = document.createElement('p');
    text.className = 'command-text';
    text.innerText = `${msg.user} redeemed ${msg.name}`;

    const displayBox = document.createElement('div');
    displayBox.className = 'command-display';
    displayBox.appendChild(img);
    displayBox.appendChild(text);

    container.appendChild(displayBox);

    setTimeout(() => {
      displayBox.classList.add('visible');
    }, 50);

    setTimeout(() => {
      displayBox.classList.remove('visible');
    }, 4000);

    setTimeout(() => {
      container.removeChild(displayBox);
    }, 5000);
  }
};

ws.onerror = () => {
  console.error('WebSocket error!');
};

ws.onopen = () => {
  console.log('WebSocket connection established');
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

ws.onmessage = event => {
  const msg = JSON.parse(event.data);

  if (msg === 'ping') {
    ws.send('pong');
  }

  handleCommand(msg);
};
