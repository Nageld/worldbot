require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
  commandPrefix: '!',
  owner: ['175714457723338752', '185069144184455168'], // Book and Visco
  unknownCommandResponse: false,
});


client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerGroups([
    ['first', 'Your First Command Group'],
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  const botVersion = process.env.npm_package_version ? ` v${process.env.npm_package_version}` : '';
  console.log(`===== WorldBot${botVersion} ready =====`);
  console.log(`Logged in as '${client.user.tag}' (${client.user.id})`);
});

// spams with huge objects but can be used for logging
// client.on('message', (message) => {
//   console.log(message);
// });

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
