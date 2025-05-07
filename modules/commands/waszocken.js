// modules/commands/waszocken.js
module.exports = {
  name: 'waszocken',
  displayName: 'LaberNugget',
  description: 'Wählt zufällig ein Game aus deinen settings.emojiMap',
  execute(message, args, client, settings) {
    const pool = args.length ? args : Object.keys(settings.emojiMap);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const emoji = settings.emojiMap[pick] || settings.defaultEmoji;
    message.reply(`${emoji} Heute zocken wir: **${pick}**`);
    const pun = require('../fun/punEngine').getPun();
    message.channel.send(`💬 ${pun}`);
  }
};
