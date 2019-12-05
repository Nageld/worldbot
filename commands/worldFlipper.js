const path = require('path');
const { Attachment, RichEmbed } = require('discord.js');

const group = path.parse(__filename).name;

const getArtEmbed = unit => new RichEmbed()
  .setTitle(unit.ENName + ' ' + unit.JPName)
  .setImage(unit.ImageURL);

const getGifEmbed = unit => new RichEmbed()
  .setTitle(unit.ENName + ' ' + unit.JPName)
  .setImage(unit.GifURL);

const getInfoEmbed = unit => {
  const rarity = Array(parseInt(unit.Rarity, 10)).fill(':star:').join('');
  return new RichEmbed()
    .setTitle(unit.ENName + ' ' + unit.JPName)
    .setDescription('**Attribute: **' + unit.Attribute
      + '\n**Leader Skill: **' + unit.LeaderBuff
      + '\n**Active Skill: **' + unit.Skills
      + '\n**Rarity: **' + rarity)
    .addField('Ability 1', unit.Ability1, true)
    .addField('Ability 2', unit.Ability2, true)
    .addField('Ability 3', unit.Ability3, true)
    .setThumbnail(unit.ImageURL)
    .setFooter(unit.Role);
};

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

const character = {
  name: 'character',
  group,
  args: true,
  usage: '<chara name>',
  aliases: ['c', 'char'],
  description: 'Lists information about the given character.',
  async execute(message, args) {
    const artReaction = '🎨';
    const infoReaction = 'ℹ️';
    const gifReaction = '🎥';
    const reactionExpiry = 30000;

    const chara = args.length ? args[0].toLowerCase() : null;

    const unit = global.CharacterData.find(char => char.ENName.toLowerCase() === chara.toLowerCase());
    if (!unit) {
      return message.channel.send('No character found!');
    }

    const filter = (reaction, user) => {
      return [artReaction, infoReaction, gifReaction].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const msg = await message.channel.send(getInfoEmbed(unit));
    await msg.react(artReaction);
    await msg.react(infoReaction);
    await msg.react(gifReaction);
    const collector = msg.createReactionCollector(filter, { max: 10, time: reactionExpiry });
    collector.on('collect', r => {
      if (r.emoji.name === artReaction) {
        msg.edit(getArtEmbed(unit));
      }
      if (r.emoji.name === infoReaction) {
        msg.edit(getInfoEmbed(unit));
      }
      if (r.emoji.name === gifReaction) {
        msg.edit(getGifEmbed(unit));
      }
    });

    collector.on('end', () => msg.clearReactions());
  },
};

module.exports = [rotation, guide, tls, character];
