const { RichEmbed } = require('discord.js');

const rotation = {
  name: 'rotation',
  aliases: ['rot', 'rotations', 'r'],
  description: 'Replies with the daily material dungeon chart.',
  execute(message) {
    const embed = new RichEmbed()
      .attachFile('./assets/charts/rotations.png')
      .setImage('attachment://rotation.png');
    return message.channel.send({ embed });
  },
};

const guide = {
  name: 'guide',
  aliases: ['g', 'beginner'],
  description: 'Replies with the beginner progression guide.',
  execute(message) {
    const guideLink = 'https://docs.google.com/document/d/1kOxR6SSj7TB564OI4f-nZ-tX2JioyoBGEK_a498Swcc/edit';
    return message.channel.send(`The Beginner Progression Guide can be found here:\n${guideLink}`);
  },
};

const tls = {
  name: 'translations',
  aliases: ['tl', 'translation'],
  description: 'Replies with the translation sheet.',
  execute(message) {
    return message.channel.send('The main translation document can be found here:\nhttps://docs.google.com/spreadsheets/d/1moWhlsmAFkmItRJPrhhi9qCYu8Y93sXGyS1ZBo2L38c/htmlview?usp=sharing&sle=true');
  },
};

const test = {
  name: 'dump',
  execute(message) {
    const charas = global.CharacterData.map(char => char.ENName).join(', ');

    return message.channel.send(charas);
  },
};

module.exports = [rotation, guide, tls, test];
