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
      comfy.Say('jlengsHolyBucket Yes, you’re Chris. jlengsHolyBucket', channel)
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
  so: (user, message, {broadcaster, mod}, {channel}) => {
    // only broadcasters or mods can shoutout
    // don't want the !so command to fight with any existing channel !so commands
    // so should return if not BOTOWNER
    if((!broadcaster && !mod) || channel !== process.env.BOTOWNER ) {
      return;
    }
    const parts = message.split(" ");
    const targetChannel = parts.find(part => part.startsWith("@"))
    if(!targetChannel) {
      return;
    }
    comfy.Say(`jlengsHolyBucket Please checkout ${targetChannel} at https://twitch.tv/${targetChannel.replace('@','')} jlengsBeardy `)
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
  [process.env.BOTOWNER, 'chrisbiscardi'],
  true,
);
