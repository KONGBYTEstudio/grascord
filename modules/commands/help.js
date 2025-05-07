// modules/commands/help.js
module.exports = {
    name: 'help',
    displayName: 'Hilfe',
    description: 'Zeigt alle verfügbaren Befehle',
    execute(message, args, client) {
      const lines = [...client.commands.values()]
        .filter(cmd => !cmd.adminOnly)
        .map(cmd => `• **${cmd.displayName || cmd.name}** (\`${cmd.name}\`): ${cmd.description}`)
        .join('\n');
      message.reply(`**Verfügbare Befehle**\n${lines}`);
    }
  };
  