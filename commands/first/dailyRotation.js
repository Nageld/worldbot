const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class DailyRotationCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rotation',
      aliases: ['rot', 'rotations', 'r'],
      group: 'first',
      memberName: 'daily rotation',
      description: 'Replies with the daily material dungeon chart',
    });
  }

  run(message) {
    const embed = new RichEmbed()
      .attachFile('./assets/charts/rotations.png')
      .setImage('attachment://rotation.png');
    return message.channel.send({ embed });
  }
};

