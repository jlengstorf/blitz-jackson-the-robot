import playSound from './util/play-sound.js';
import corgiStampede from './effects/corgi-stampede.js';
import emoteCount from './effects/emote-count.js';

// on http:// we need to use ws:// but over SSL we need to use wss://
// this is kind of a hack to make sure we’re always matching protocols
const ws = new WebSocket(
  `${location.protocol.replace('http', 'ws')}//${location.host}`,
);

// seconds * 1000 to get a timeout
const CMD_COOLDOWN = 30 * 1000;
const cmdDisplay = document.querySelector('.command-display');

const commandsOnTimeOut = new Map();

const handleChat = msg => {
  if (msg.emotes) {
    emoteCount(msg.emotes, corgiStampede);
  }
};

const handleCommand = msg => {
  // if this command has been called too recently, bail
  if (commandsOnTimeOut.get(msg.name)) {
    return;
  }

  if (msg.name === 'release-the-corgis') {
    corgiStampede();
    return;
  }

  // play audio if the command has any
  if (msg.sfx) {
    playSound(msg.sfx);

    // set a cooldown period to avoid being too noisy
    commandsOnTimeOut.set(msg.name, true);
    setTimeout(() => {
      commandsOnTimeOut.delete(msg.name);
    }, CMD_COOLDOWN);
  }

  // show a GIF if the command has one
  if (msg.gif) {
    const img = cmdDisplay.querySelector('img');
    img.classList.add('command-image', 'visible');
    img.src = msg.gif;

    const text = cmdDisplay.querySelector('text');
    text.innerText = `${msg.user} redeemed ${msg.name}`;

    const duration = (msg.duration || 4) * 1000;

    setTimeout(() => {
      cmdDisplay.classList.add('visible');
    }, 50);

    setTimeout(() => {
      cmdDisplay.classList.remove('visible');
    }, duration);
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
  const url = new URL(location);
  const msg = JSON.parse(event.data);

  if (url.searchParams.get('channel') !== msg.channel) {
    return;
  }

  if (msg === 'ping') {
    ws.send('pong');
  }

  if (msg.type === 'chat') {
    handleChat(msg);
  }

  handleCommand(msg);
};
