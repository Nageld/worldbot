const path = require('path');
const { Attachment, RichEmbed } = require('discord.js');

const group = path.parse(__filename).name;

const getArtEmbed = unit =>
  new RichEmbed()
    .setTitle(unit.ENName + ' ' + unit.JPName)
    .setImage(unit.ImageURL);

const getGifEmbed = unit => new RichEmbed()
  .setTitle(unit.ENName + ' ' + unit.JPName)
  .setImage(unit.GifURL);

const getInfoEmbed = unit => new RichEmbed()
  .setTitle(unit.ENName + ' ' + unit.JPName)
  .setDescription('**Attribute: **' + unit.Attribute + '\n**Leader Skill:**' + unit.LeaderBuff + '\n**Active Skill:**' + unit.Skills)
  .addField('Ability 1', unit.Ability1, true)
  .addField('Ability 2', unit.Ability2, true)
  .addField('Ability 3', unit.Ability3, true)
  .setThumbnail(unit.ImageURL)
  .setFooter(unit.Role);

const rotation = {
  name: 'rotation',
  group,
  aliases: ['rot', 'rotations', 'r'],
  description: 'Shows the daily material dungeon schedule.',
  execute(message) {
    const attachment = new Attachment('./assets/charts/rotations.png', 'rotations.png');
    return message.channel.send('', attachment);
  },
};

const guide = {
  name: 'guide',
  group,
  aliases: ['g', 'beginner'],
  description: 'Links LilyCat\'s Beginner Progression Guide.',
  execute(message) {
    const guideLink = 'https://docs.google.com/document/d/1kOxR6SSj7TB564OI4f-nZ-tX2JioyoBGEK_a498Swcc/edit';
    return message.channel.send(`The Beginner Progression Guide can be found here:\n${guideLink}`);
  },
};

const tls = {
  name: 'translations',
  group,
  aliases: ['tl', 'translation'],
  description: 'Links Doli\'s Translation Sheet.',
  execute(message) {
    const tlDocLink = 'https://docs.google.com/spreadsheets/d/1moWhlsmAFkmItRJPrhhi9qCYu8Y93sXGyS1ZBo2L38c/edit';
    return message.channel.send(`The main translation document can be found here:\n${tlDocLink}`);
  },
};

// const test = {
//   name: 'dump',
//   hidden: true,
//   execute(message) {
//     const charas = global.CharacterData.map(char => char.ENName).join(', ');

//     return message.channel.send(charas);
//   },
// };

const character = {
  name: 'char',
  group,
  usage: () => `${process.env.PREFIX}${this.name} <chara name>`,
  aliases: ['c', 'character'],
  description: 'Lists information about the given character.',
  async execute(message, args) {
    const chara = args.length ? args[1].toLowerCase() : null;
    // can be moved to index.js:47
    if (!chara) {
      return message.channel.send(`No character name supplied! Usage: ${this.usage()}`);
    }
    const unit = global.CharacterData.find(char => char.ENName.toLowerCase() === chara.toLowerCase());
    if (!unit) {
      return message.channel.send('No Character Found!');
    }

    const filter = (reaction, user) => {
      return ['🎨', 'ℹ️', '🎥'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const msg = await message.channel.send(getInfoEmbed(unit));
    await msg.react('🎨');
    await msg.react('ℹ️');
    await msg.react('🎥');
    const collector = msg.createReactionCollector(filter, { max: 10, time: 15000 });
    collector.on('collect', r => {
      if (r.emoji.name === '🎨') {
        msg.edit(getArtEmbed(unit));
      }
      if (r.emoji.name === 'ℹ️') {
        msg.edit(getInfoEmbed(unit));
      }
      if (r.emoji.name === '🎥') {
        msg.edit(getGifEmbed(unit));
      }
    });
  },
};

module.exports = [rotation, guide, tls, character];
