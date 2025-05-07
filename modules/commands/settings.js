// modules/commands/settings.js
module.exports = {
    name: 'settings',
    displayName: 'Blättchennetz',
    description: 'Zeigt aktuelle Bot-Einstellungen',
    execute(message, args, client, settings) {
      const lines = Object.entries(settings.modules)
        .map(([mod, on]) => {
          const cmd = client.commands.get(mod);
          const label = cmd?.displayName || mod;
          return `• ${label}: ${on ? '✅' : '❌'}`;
        }).join('\n');
      message.channel.send(`📋 **Einstellungen:**\n${lines}`);
    }
  };
  