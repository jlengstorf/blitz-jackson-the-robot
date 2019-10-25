require('dotenv').config();
const comfy = require('comfy.js');
const axios = require('axios');

let dbCommands = [];

const sendQuery = async (query, variables = {}) => {
  const { data, errors } = await axios
    .post(
      'https://graphql.fauna.com/graphql',
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
        },
      },
    )
    .catch(error => {
      console.error(error);
    });

  if (errors) {
    console.error(errors);
  }

  return data.data;
};

const loadCommands = async () => {
  const data = await sendQuery(`
    query {
      getActiveCommands(isActive: true) {
        data {
          _id
          command
          message
        }
      }
    }
  `);

  dbCommands = data.getActiveCommands.data;
};

const updateOrCreateCommand = async (command, message) => {
  const currentCommand = dbCommands.find(cmd => cmd.command === command);

  if (currentCommand) {
    const data = await sendQuery(
      `
        mutation ($id: ID! $command: String! $message: String!) {
          updateCommand(
            id: $id
            data: {
              command: $command
              message: $message
              timeout: 60
              isActive: true
            }
          ) {
            _id
            command
            message
          }
        }
      `,
      {
        id: currentCommand._id,
        command: currentCommand.command,
        message,
      },
    );

    // TODO save the updated command to dbCommands
    const cmdIndex = dbCommands.findIndex(cmd => cmd.command === command);
    dbCommands[cmdIndex] = data.updateCommand;

    console.log(dbCommands);
    return;
  }

  const data = await sendQuery(
    `
      mutation ($command: String! $message: String!) {
        createCommand(data: {
          command: $command
          message: $message
          timeout: 60
          isActive: true
        }) {
          _id
          command
          message
        }
      }
    `,
    {
      command,
      message,
    },
  );

  dbCommands = dbCommands.concat(data.createCommand);
  console.log(dbCommands);
};

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
  so: (user, message, { broadcaster, mod }, { channel }) => {
    // only broadcasters or mods can shoutout
    // don't want the !so command to fight with any existing channel !so commands
    // so should return if not BOTOWNER
    if ((!broadcaster && !mod) || channel !== process.env.BOTOWNER) {
      return;
    }
    const parts = message.split(' ');
    const targetChannel = parts.find(part => part.startsWith('@'));
    if (!targetChannel) {
      return;
    }
    comfy.Say(
      `jlengsHolyBucket Please checkout ${targetChannel} at https://twitch.tv/${targetChannel.replace(
        '@',
        '',
      )} jlengsBeardy `,
    );
  },
};

comfy.onCommand = (user, command, message, flags, extra) => {
  const currentCommand = dbCommands.find(cmd => cmd.command === command);
  const canEdit = flags.broadcaster || flags.mod;

  if (command === 'commander' && canEdit) {
    const parts = message.split(' ');
    const [cmd, ...msgParts] = parts;
    const msg = msgParts.join(' ');

    updateOrCreateCommand(cmd, msg);
  }

  if (currentCommand) {
    console.log(JSON.stringify(flags));
    comfy.Say(currentCommand.message, extra.channel);
  }

  if (Object.keys(commands).includes(command)) {
    commands[command](user, message, flags, extra);
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
