const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['help', 'commands', 'h'],
      group: 'first',
      memberName: 'help',
      description: 'Provides a list of the bot commands',
    });
  }
  run(message) {
    const embed = new RichEmbed()
      .setTitle('Commands')
      .setDescription('All Commands can be abbreviated')
      .addField('!bosses', 'Lists all bosses and their weapons', true)
      .addField('!Character [Character Name]', 'Lists information about the given character', true)
      .addField('!Weapon [Weapon Name]', 'Lists information about the given weapon(Only has boss weapons atm).', true)
      .addField('!translations', 'Links Doli\'s Translation Sheet', true)
      .addField('!rotation', 'Shows the daily material dungeon schedule', true)
      .addField('!guide', 'Links LilyCat\'s Beginner Progression Guide', true)

      .setTimestamp();
    return message.embed(embed);
  }
};