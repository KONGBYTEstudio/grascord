// modules/commands/modules.js

module.exports = {
    name: 'modules',
    displayName: 'Module-Manager',
    description: 'Listet alle Module + Status oder toggle: modules enable <name> / disable <name>',
    adminOnly: true,
  
    execute(message, args, client, settings, sendMessage) {
      const mods = settings.modules;
  
      // ohne Argument → Liste aller Module mit Status
      if (args.length === 0) {
        const lines = Object.entries(mods)
          .map(([mod, on]) => `${on ? '✅' : '❌'} **${mod}**`)
          .join('\n');
        return message.reply(`📦 Module und Status:\n${lines}`);
      }
  
      // Mit Argumenten → enable/disable
      const sub = args[0].toLowerCase();
      const target = args[1];
      if (!['enable', 'disable'].includes(sub) || !target) {
        return message.reply('Usage: modules [enable|disable] <modulename>');
      }
      if (!(target in mods)) {
        return message.reply(`❌ Kein Modul mit dem Namen "${target}" gefunden.`);
      }
  
      // togglen
      mods[target] = (sub === 'enable');
      // settings.json updaten
      const fs = require('fs');
      const path = require('path');
      const cfgPath = path.join(__dirname, '../../config/settings.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath));
      cfg.modules = mods;
      fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  
      return message.reply(`${sub === 'enable' ? '✅' : '❌'} Modul **${target}** wurde ${sub}d.`);
    }
  };
  