// modules/commands/icebreaker-set.js
const fs   = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, '../../config/settings.json');

function loadSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}
function saveSettings(cfg) {
  fs.writeFileSync(settingsPath, JSON.stringify(cfg, null, 2));
}

module.exports = {
  name: 'icebreaker-set',
  displayName: 'Icebreaker-Channel',
  description: 'Setzt oder löscht den Channel für Icebreaker-Fragen. Usage: icebreaker-set <#channel|off>',
  adminOnly: true,

  execute(message, args) {
    const cfg = loadSettings();

    if (args[0] === 'off') {
      delete cfg.icebreakerChannelId;
      saveSettings(cfg);
      return message.reply('❌ Icebreaker-Channel entfernt.');
    }

    const mention = message.mentions.channels.first();
    if (!mention) {
      return message.reply('Bitte erwähne einen Text-Channel oder gib `off` an.');
    }

    cfg.icebreakerChannelId = mention.id;
    saveSettings(cfg);
    return message.reply(`✅ Icebreaker-Channel gesetzt auf ${mention}.`);
  }
};
