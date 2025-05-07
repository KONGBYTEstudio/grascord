// modules/commands/switch.js
const fs = require('fs');

module.exports = {
  name: 'switch',
  displayName: 'Graskabel',
  description: 'Wechselt den VC-Feed in einen anderen Textkanal',
  adminOnly: true,
  execute(message, args, client, settings) {
    const [mention] = args;
    if (!mention?.startsWith('<#') || !mention.endsWith('>')) {
      return message.reply('Usage: switch #channel');
    }
    const channelId = mention.slice(2, -1);
    settings.feedChannelId = channelId;
    fs.writeFileSync('./config/settings.json', JSON.stringify(settings, null, 2));
    message.reply(`Feed gewechselt zu <#${channelId}>`);
  }
};
