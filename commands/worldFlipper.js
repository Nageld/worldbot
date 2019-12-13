const path = require('path');
const axios = require('axios');
const { Attachment, RichEmbed, MessageCollector } = require('discord.js');

const group = path.parse(__filename).name;

const getArtEmbed = unit => new RichEmbed()
  .setTitle(unit.EnName + ' ' + unit.JpName)
  .setImage(unit.SpriteURL);

const getGifEmbed = unit => new RichEmbed()
  .setTitle(unit.EnName + ' ' + unit.JpName)
  .setImage(unit.GifURL);

const getInfoEmbed = unit => {
  const rarity = Array(parseInt(unit.Rarity, 10)).fill(':star:').join('');
  return new RichEmbed()
    .setTitle(unit.EnName + ' ' + unit.JpName)
    .setDescription('**Attribute: **' + unit.JpAttribute + ' ' + unit.EnAttribute
      + '\n**Leader Skill: **' + unit.EnLeaderBuff
      + '\n**Active Skill: **' + unit.EnSkillName + 'Cost: ' + unit.SkillCost
      + '\n' + unit.EnSkillDesc
      + '\n**Rarity: **' + rarity)
    .addField('Ability 1', unit.EnAbility1, true)
    .addField('Ability 2', unit.EnAbility2, true)
    .addField('Ability 3', unit.EnAbility3, true)
    .setThumbnail(unit.SpriteURL)
    .setFooter(unit.Role ? unit.Weapon + ' / ' + unit.Role : unit.Weapon);
};

const sendMessage = async (unit, message) => {
  const artReaction = '🎨';
  const infoReaction = 'ℹ️';
  const gifReaction = '🎥';
  const reactionExpiry = 30000;
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

    const chara = args.length ? args.join(' ').toLowerCase() : null;
    const res = await axios.get(`${process.env.API_URL}lookup?name=${chara}`);
    const data = res.data;

    if (data.length === 0) {
      return message.channel.send('No character found!');
    }

    const unit = (function() {
      if (data.length === 1) {
        return data[0];
      }

      const nameExact = data.find(char => char.EnName.toLowerCase() === chara);
      if (nameExact) {
        return nameExact;
      }
      return data.map((char, index) => (index + ': ' + char.EnName + ' ' + char.Weapon)).join('\n');
    })();

    if (typeof unit === 'string') {
      await message.channel.send('Found potential matches:\n```' + unit + '```');
      const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1, time: 15000 });
      collector.on('collect', m => {
        data[m] ? sendMessage(data[m], message) : null;
      });
    } else {
      sendMessage(data[0], message);
    }
  },
};

module.exports = [rotation, guide, tls, character];
