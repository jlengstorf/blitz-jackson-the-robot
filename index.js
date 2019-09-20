require('dotenv').config();
const comfy = require('comfy.js');
const guest = {
  name: '',
  socialMediaUrl: '',
}

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
  guest: (user, message, {broadcaster, mod}, {channel}) => {
    if(channel !== process.env.BOTOWNER) {
      return;
    }
    const generateMessage = () => {
      if(guest.name === '' || guest.socialMediaUrl === '') {
        return `There is no guest set. ${channel} , are you running solo today? jlengsBeardy`
      }
      return `jlengsHolyBucket jlengsHolyBucket Our guest today is ${guest.name}
      Please follow them at ${guest.socialMediaUrl}
      jlengsHolyBucket jlengsHolyBucket
      `
    }
    const parts = message.split(' ')
    if(!broadcaster && !mod || parts.length === 0){
      comfy.Say(generateMessage(), channel)
      return;
    }
    guest.name = parts[0]
    guest.socialMediaUrl = parts[1]
    comfy.Say(`jlengsHolyBucket Guest successfully added. !guest command now says: ${generateMessage()} `)
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

