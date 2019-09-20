require('dotenv').config();
const comfy = require('comfy.js');

const commands = {
  blitzed: (user, message, flags, extra) => {
    console.log({ user, message, flags, extra });
    comfy.Say('KAPOW YOU GOT BLITZED! MorphinTime', extra.channel);
  },
  chris: (user, _,_, {channel}) => {
    if(user !== 'chrisbiscardi') {
    comfy.Say('LISTEN TO CHRIS! Chris is always right jlengsBeardy')
    } else {
      comfy.Say('jlengsHolyBucket Yes, you\'re Chris. jlengsHolyBucket', channel)
    }
  },
  echo: (user, message, { broadcaster, mod }, { channel }) => {
    if (!broadcaster && !mod) {
      comfy.Say(
        `You’re not my real dad, @${user}. I don’t have to listen to you.`,
        channel,
      );
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
