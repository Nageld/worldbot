const { RichEmbed } = require('discord.js');

const help = {
  name: 'help',
  aliases: ['help', 'commands', 'h'],
  group: 'first',
  memberName: 'help',
  description: 'Provides a list of the bot commands',
  execute(message) {
    // TODO: Dynamically gather command info
    // https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command
    const embed = new RichEmbed()
      .setTitle('Commands')
      .setDescription('All commands can be abbreviated')
      .addField('!bosses', 'Lists all bosses and their weapons', true)
      .addField('!character [Character Name]', 'Lists information about the given character', true)
      .addField('!weapon [Weapon Name]', 'Lists information about the given weapon(Only has boss weapons atm).', true)
      .addField('!translations', 'Links Doli\'s Translation Sheet', true)
      .addField('!rotation', 'Shows the daily material dungeon schedule', true)
      .addField('!guide', 'Links LilyCat\'s Beginner Progression Guide', true)
      .setTimestamp();

    return message.channel.send(embed);
  },
};

const ping = {
  name: 'ping',
  description: 'Ping!',
  async execute(message) {
    const msg = await message.channel.send('Pong!');
    return msg.edit('Pong! Time taken: NEED TO CALC');
  },
};

module.exports = [help, ping];
