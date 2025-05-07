// modules/commands/module.js
const fs = require('fs');
const cfg = require('../../config/settings.json');

module.exports = {
  name: 'module',
  displayName: 'Modul-Manager',
  description: 'Schaltet ein Modul an/aus: module enable|disable <name>',
  adminOnly: true,
  execute(message, args) {
    const [action, mod] = args;
    if (!['enable','disable'].includes(action) || !(mod in cfg.modules)) {
      return message.reply('Usage: module enable|disable <modulename>');
    }
    cfg.modules[mod] = action === 'enable';
    fs.writeFileSync('./config/settings.json', JSON.stringify(cfg, null, 2));
    const label = client.commands.get(mod)?.displayName || mod;
    message.reply(`Modul **${label}** wurde ${action === 'enable' ? 'aktiviert' : 'deaktiviert'}.`);
  }
};
