const { sendMessage } = require('./socket');
const commands = {};

module.exports = (req, res) => {
  const msg = req.body;

  if (Object.keys(commands).includes(msg.command)) {
    // TODO fire the command
    const cmd = commands[msg.command](null, null, null, {
      channel: msg.channel,
    });

    if (!cmd) {
      res.send('Error: no command found!');
    }

    sendMessage({ ...cmd, user: 'The LWJ Soundboard' });
    res.send(`Sent command ${cmd.name}`);
    return;
  }

  res.send('hi!');
};
