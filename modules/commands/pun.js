// modules/commands/pun.js
const punEngine = require('../fun/punEngine');
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, '../../config/settings.json');

function reloadSettings() {
  return JSON.parse(fs.readFileSync(settingsPath));
}

module.exports = {
  name: 'pun',
  displayName: 'Pun-Manager',
  description: 'Verwaltet und liefert Puns. Usage: pun [get|get #cat]|add <Text> [#cat]|remove <Index> [#cat]|list [#cat]|random [#cat]',
  adminOnly: true, // Admins können Puns bearbeiten

  execute(message, args) {
    const sub = args.shift()?.toLowerCase();
    const settings = reloadSettings();
    const reply = (txt) => message.channel.send(txt);

    switch (sub) {
      case 'get':
      case undefined: {
        const cat = args[0]?.startsWith('#') ? args[0].slice(1) : null;
        return reply(punEngine.getPun(cat));
      }

      case 'random': {
        const cat = args[0]?.startsWith('#') ? args[0].slice(1) : null;
        return reply(punEngine.getPun(cat));
      }

      case 'add': {
        if (args.length < 1) return reply('Usage: pun add <Text> [#Kategorie]');
        const maybeCat = args[args.length-1];
        const category = maybeCat.startsWith('#') ? maybeCat.slice(1) : null;
        const text = category ? args.slice(0, -1).join(' ') : args.join(' ');
        punEngine.addPun(text, category);
        return reply(`✅ Pun hinzugefügt${category ? ` in Kategorie **${category}**` : ''}: "${text}"`);
      }

      case 'remove': {
        if (args.length < 1) return reply('Usage: pun remove <Index> [#Kategorie]');
        const index = parseInt(args[0], 10) - 1;
        if (isNaN(index)) return reply('❌ Ungültiger Index.');
        const cat = args[1]?.startsWith('#') ? args[1].slice(1) : null;
        const removed = punEngine.removePun(index, cat);
        if (removed) return reply(`🗑️ Pun entfernt: "${removed}"`);
        return reply('❌ Kein Pun an dieser Stelle gefunden.');
      }

      case 'list': {
        const cat = args[0]?.startsWith('#') ? args[0].slice(1) : null;
        const list = punEngine.listPuns(cat);
        if (!list.length) return reply('🔍 Keine Puns gefunden.');
        const lines = list.map((p, i) => `\`${i+1}\` • ${p}`).join('\n');
        return reply(`📜 Puns${cat ? ` in **${cat}**` : ''}:\n${lines}`);
      }

      case 'help': {
        return reply(this.description);
      }

      default:
        return reply('❓ Unknown subcommand. Type `pun help` for usage.');
    }
  }
};
