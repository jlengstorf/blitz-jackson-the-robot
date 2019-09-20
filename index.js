require('dotenv').config();
const comfy = require('comfy.js');

const naughtyNaughty = (user, channel) =>
  comfy.Say(
    `You’re not my supervisor, @${user}. I don’t have to listen to you.`,
    channel,
  );

const commands = {
  blitzed: (user, message, flags, extra) => {
    console.log({ user, message, flags, extra });
    comfy.Say('KAPOW YOU GOT BLITZED! MorphinTime', extra.channel);
  },
  chris: (user, _message, _flags, { channel }) => {
    if (user !== 'chrisbiscardi') {
      comfy.Say('LISTEN TO CHRIS! Chris is always right jlengsBeardy', channel);
    } else {
      comfy.Say(
        'jlengsHolyBucket Yes, you’re Chris. jlengsHolyBucket',
        channel,
      );
    }
  },
  echo: (user, message, { broadcaster, mod }, { channel }) => {
    if (!broadcaster && !mod) {
      naughtyNaughty(user, channel);
      return;
    }

    comfy.Say(message, channel);
  },
};

comfy.onCommand = (user, command, message, flags, extra) => {
  if (Object.keys(commands).includes(command)) {
    commands[command](user, message, flags, extra);
  }
};

comfy.Init(
  process.env.TWITCHUSER,
  process.env.OAUTH,
  ['jlengstorf', 'chrisbiscardi'],
  true,
);
