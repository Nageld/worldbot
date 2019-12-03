require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = process.env.PREFIX || '!!';
const timeout = parseInt(process.env.TIMEOUT, 10) || 10000;

client.commands = new Discord.Collection();

global.CharacterData = require('./data/Characters');
global.BossWeaponsData = require('./data/BossWeapons');

const timeoutAsync = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const commands = require(`./commands/${file}`);
  if (Array.isArray(commands)) {
    commands.forEach(c => client.commands.set(c.name, c));
  } else {
    client.commands.set(commands.name, commands);
  }
}

client.once('ready', () => {
  const botVersion = process.env.npm_package_version ? ` v${process.env.npm_package_version}` : '';
  console.log(`===== WorldBot${botVersion} ready =====`);
  console.log(`Logged in as '${client.user.tag}' (${client.user.id})`);
});


client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    return;
  }

  try {
    if (message.channel.id !== '648762883613917194') {
      await timeoutAsync(timeout);
    }
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    if (message.channel.id === '648762883613917194') {
      message.channel.send('There was an error trying to execute that command!');
    }
  }
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
