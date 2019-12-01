const { Command } = require('discord.js-commando');

module.exports = class GuideCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'guide',
      aliases: ['g', 'beginner'],
      group: 'first',
      memberName: 'guide',
      description: 'Replies with the beginner progression guide',
    });
  }

  run(message) {
    return message.say('The Beginner Progression Guide can be found here:\nhttps://docs.google.com/document/d/1kOxR6SSj7TB564OI4f-nZ-tX2JioyoBGEK_a498Swcc/edit#heading=h.g2zgvk9ffugl');
  }
};