// modules/fun/rageTracker.js

const settings = require('../../config/settings.json');
const { getPun } = require('./punEngine');

const defaultTaunts = [
  "Schon genug Frust abgelassen, <user>?",
  "Rage-Quit? Aber hallo!",
  "Na, wieder die Nerven verloren?",
  "Weg da – <user> explodiert gleich!",
  "Take a break, <user>!"
];

module.exports = {
  name: 'rageTracker',
  init(client, settings, sendMessage) {
    client.on('voiceStateUpdate', (oldState, newState) => {
      // User hat den VC verlassen (alt drin, jetzt raus)
      if (oldState.channelId && !newState.channelId) {
        const user = oldState.member.displayName;
        const taunts = Array.isArray(settings.rageTaunts) && settings.rageTaunts.length
          ? settings.rageTaunts
          : defaultTaunts;
        const taunt = taunts[Math.floor(Math.random() * taunts.length)]
          .replace('<user>', `**${user}**`);
        sendMessage(oldState.channelId, `💥 ${taunt}`);
      }
    });
  }
};
