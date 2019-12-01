const { Command } = require('discord.js-commando');

module.exports = class TranslationsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'translations',
      aliases: ['tl', 'translation'],
      group: 'first',
      memberName: 'translations',
      description: 'Replies with the translation sheet',
    });
  }

  run(message) {
    return message.say('The main translation document can be found here:\nhttps://docs.google.com/spreadsheets/d/1moWhlsmAFkmItRJPrhhi9qCYu8Y93sXGyS1ZBo2L38c/htmlview?usp=sharing&sle=true');
  }
};