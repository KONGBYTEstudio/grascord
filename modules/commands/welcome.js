// modules/commands/welcome.js
module.exports = {
    name: 'welcome',
    displayName: 'Rauchsignal',
    description: 'Schickt Onboarding-Hinweise per DM',
    execute(message) {
      message.author.send(`
  👋 Willkommen bei GrasCord!
  • Nutze **!help** oder **/help** für alle Befehle.
  • Voice-Joins posten automatisch hier.
  • Admins können Module per **/module** ein-/ausschalten.
  `);
      message.author.send(`• Du kannst Module, die du einstellen möchtest, per **/module** aufrufen.
      `);
      message.author.send(`• Du kannst auch **/module** aufrufen, um alle Module anzuzeigen.
      `);
      message.author.send(`• Du kannst auch **/feedback** geben, wenn du Ideen hast.
      `);
      message.reply('Ich habe dir eine DM geschickt!');
    }
  };
  