require('dotenv').config();
const { CommandoClient } = require('discord.js-commando');

const client = new CommandoClient({
  commandPrefix: '!',
  owner: ['175714457723338752', '185069144184455168'], // Book and Visco
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands();

client.once('ready', () => {
  console.log(`===== WorldBot v${process.env.npm_package_version} ready =====`);
  console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
});

// spams with huge objects but can be used for logging
// client.on('message', (message) => {
//   console.log(message);
// });

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
