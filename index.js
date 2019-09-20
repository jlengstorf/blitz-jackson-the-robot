require('dotenv').config();
const comfy = require('comfy.js');

const commands = {
  blitzed: (user, message, flags, extra) => {
    console.log({ user, message, flags, extra });
    comfy.Say('KAPOW YOU GOT BLITZED! MorphinTime', extra.channel);
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
  so: (user, message, {broadcaster, mod}, {channel}) => {
    // only broadcasters or mods can shoutout
    if(!broadcaster && !mod) {
      return;
    }
    const parts = message.split(" ");
    const channel = parts.find(part => part.startsWith("@"))
    if(!channel) {
      return;
    }
    comfy.Say(`jlengsHolyBucket Please checkout ${channel} at https://twitch.tv/${channel} jlengsBeardy `)
  }
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
