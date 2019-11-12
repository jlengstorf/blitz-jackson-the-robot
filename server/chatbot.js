const comfy = require('comfy.js');

let socket = false;
let pinger;

module.exports = wss => {
  const { loadCommands, updateOrCreateCommand } = require('./db');

  // listen for a websocket connection and grab it for sending events
  wss.on('connection', ws => {
    // we only want to have one active socket to avoid duplicates
    // this kinda feels like a hack, but it does what I want so #yolo
    socket = ws;

    // if you want to debug, uncomment this and send messages from the client
    // socket.on('message', message => {
    //   console.log(message);
    // });

    // set a ping interval to keep the connection alive
    clearInterval(pinger);
    pinger = setInterval(() => {
      socket.send(JSON.stringify('ping'));
    }, 15000);
  });

  // we also support custom commands that needs extra logic, etc.
  const blitzed = require('./commands/blitzed');
  const chris = require('./commands/chris');
  const so = require('./commands/so');

  const commands = { blitzed, chris, so };

  comfy.onCommand = async (user, command, message, flags, extra) => {
    const dbCommands = await loadCommands();
    const dbCommand = dbCommands.find(cmd => cmd.command === command);
    const canEdit = flags.broadcaster || flags.mod;

    if (command === 'commander' && canEdit) {
      const parts = message.split(' ');
      const [cmd, ...msgParts] = parts;
      const msg = msgParts.join(' ').replace(/^!+/, '');

      updateOrCreateCommand(cmd, msg);
    }

    if (['list', 'ls', 'commands'].includes(command)) {
      const names = dbCommands.map(({ command }) => command);

      comfy.Say(`\`\`\`\n${names.join('\n')}\n\`\`\``, extra.channel);
    }

    if (dbCommand) {
      comfy.Say(dbCommand.message, extra.channel);
    }

    if (Object.keys(commands).includes(command)) {
      const result = commands[command](user, message, flags, extra);

      if (!result) {
        console.log('no message');
        return;
      }

      if (socket) {
        socket.send(JSON.stringify({ ...result, user }));
      }

      comfy.Say(result.message, result.channel);
    }
  };

  comfy.onConnected = () => {
    loadCommands();
  };

  comfy.Init(
    process.env.TWITCHUSER,
    process.env.OAUTH,
    [process.env.BOTOWNER, 'chrisbiscardi'],
    true,
  );
};
