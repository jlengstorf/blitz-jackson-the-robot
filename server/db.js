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

exports.loadCommands = async () => {
  if (dbCommands.length > 0) {
    return dbCommands;
  }

  console.log('loading commands from database');
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

  return dbCommands;
};

exports.updateOrCreateCommand = async (command, message) => {
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
};
