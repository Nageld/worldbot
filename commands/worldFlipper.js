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

const getInfoEmbed = (unit, units) => {
  const rarity = Array(parseInt(unit.Rarity, 10)).fill(':star:').join('');
  let footer = unit.Role ? unit.Weapon + ' / ' + unit.Role : unit.Weapon;

  if (units && units.length > 1) {
    // passed data has multiple units
    // add info to footer
    footer += '\nMultiple versions available:\n';
    footer += units.map((char, index) => (`${parseInt(index, 10) + 1}: ${char.EnName} ${char.Weapon}`)).join('\n');
  }

  return new RichEmbed()
    .setTitle(unit.EnName + ' ' + unit.JpName)
    .setDescription('**Attribute: **' + unit.JpAttribute + ' ' + unit.EnAttribute
    + '\n**Leader Skill: **' + unit.EnLeaderBuff
    + '\n**Active Skill: **' + unit.EnSkillName + (unit.SkillCost ? ' **Cost: **' + unit.SkillCost : '')
    + '\n' + unit.EnSkillDesc
    + '\n**Rarity: **' + rarity)
    .addField('Ability 1', unit.EnAbility1, true)
    .addField('Ability 2', unit.EnAbility2, true)
    .addField('Ability 3', unit.EnAbility3, true)
    .setThumbnail(unit.SpriteURL)
    .setFooter(footer);
};

const sendMessage = async (result, message) => {
  const msg = await message.channel.send(getInfoEmbed(result.unit, result.versions));
  let unit = result.unit;
  const artReaction = '🎨';
  const infoReaction = 'ℹ️';
  const gifReaction = '🎥';
  // alt version reactions
  const verReaction = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
  ];
  const reactionExpiry = 30000;
  const filter = (reaction, user) => {
    return [artReaction, infoReaction, gifReaction, ...verReaction].includes(reaction.emoji.name) && user.id === message.author.id;
  };

  // add reactions based on available data
  if (unit.GifURL) {
    await msg.react(gifReaction);
  }
  await msg.react(infoReaction);
  if (unit.SpriteURL) {
    await msg.react(artReaction);
  }
  if (result.versions) {
    for (let i = 0; i < result.versions.length; i++) {
      await msg.react(verReaction[i]);
    }
  }

  // create reaction collector
  const collector = msg.createReactionCollector(filter, { max: 10, time: reactionExpiry });
  collector.on('collect', r => {
    if (r.emoji.name === artReaction) {
      // replace info with art
      msg.edit(getArtEmbed(unit));
    }
    if (r.emoji.name === gifReaction) {
      // replace info with gif
      msg.edit(getGifEmbed(unit));
    }
    if (r.emoji.name === infoReaction) {
      // replace info with info
      msg.edit(getInfoEmbed(unit, result.versions));
    }
    if (result.versions
        && verReaction.indexOf(r.emoji.name) > -1
        && result.versions[verReaction.indexOf(r.emoji.name)].EnName !== unit.EnName) {
      // replace info with version based on reaction
      // replace unit data
      unit = result.versions[verReaction.indexOf(r.emoji.name)];
      // edit message with new data and pass all version information
      msg.edit(getInfoEmbed(unit, result.versions));
      // clear current reaction and add them again
      msg.clearReactions().then(async () => {
        if (unit.GifURL) {
          await msg.react(gifReaction);
        }
        await msg.react(infoReaction);
        if (unit.SpriteURL) {
          await msg.react(artReaction);
        }
        if (result.versions) {
          for (let i = 0; i < result.versions.length; i++) {
            await msg.react(verReaction[i]);
          }
        }
      });
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
    if (chara.length < 2) {
      return message.channel.send('Search too short please have a minimum of 2 letters!');
    }
    const res = await axios.get(`${process.env.API_URL}/lookup?name=${encodeURI(chara)}`);
    const data = res.data;

    if (data.unit) {
      // matches single result
      sendMessage(data, message);
    } else if (data.matches && data.matches.length > 0) {
      // matches multiple results
      // send potential matches to channel
      const options = await message.channel.send('Found potential matches:\n```' +
        data.matches.map((char, index) => (`${parseInt(index, 10) + 1}: ${char.EnName} ${char.Weapon}`)).join('\n')
        + '```');
      // start collector
      const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1, time: 15000 });
      // on user input
      collector.on('collect', m => {
        // make sure data exists
        if (typeof data.matches[m - 1] !== 'undefined') {
          // data exists, send unit data over
          const unitData = { unit: data.matches[m - 1] };
          // filter matches with JpName
          const versionFromMatches = data.matches.filter(unit => unit.JpName === unitData.unit.JpName);
          if(versionFromMatches.length > 1) {
            // there are more than 1 match, assume it's an alt version
            unitData.versions = versionFromMatches;
          }
          sendMessage(unitData, message);
          // delete query and input
          Promise.all([
            options.delete(),
            m.delete(),
          ]);
        } else {
          // user is not selecting potential match
          options.edit('No potential match selected.');
        }
      });
      // remove options on no user input
      collector.on('end', collected => {
        if (collected && collected.size === 0) {
          options.edit('No potential match selected.');
        }
      });
    } else {
      // no character found
      return message.channel.send('No character found!');
    }
  },
};

module.exports = [rotation, guide, tls, character];
