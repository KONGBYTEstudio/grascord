// modules/fun/icebreaker.js
const { setInterval } = require('timers');
const settings = require('../../config/settings.json');

const defaultQuestions = [
  "Indica oder Sativa?",
  "Bestes Bier?",
  "Best Weed?",
  "Weird-Video Runde?",
  "Was ist dein Lieblingsspiel?",
  "Wenn du eine Superkraft wählen könntest: welche wäre es?",
  "Was war dein peinlichster Moment im Gaming?",
  "Wenn du eine Superkraft wählen könntest: welche wäre es?",
  "Was war dein peinlichster Moment im Gaming?",
  "Welches Spiel hat dich zuletzt richtig geflasht?",
  "Coffee oder Tee beim Zocken?",
  "Team Deathmatch oder Battle Royale – was rockt mehr?",
  "Was ist dein Lieblings-Game-Genre?",
  "Wenn du ein Spiel für den Rest deines Lebens spielen müsstest, welches wäre es?",
  
];

module.exports = {
  name: 'icebreaker',
  init(client, settings, sendMessage) {
    const channelId = settings.icebreakerChannelId;
    if (!channelId) {
      return; // nicht konfiguriert
    }

    const questions = Array.isArray(settings.icebreakers) && settings.icebreakers.length
      ? settings.icebreakers
      : defaultQuestions;

    const interval = (settings.icebreakerIntervalMin || 30) * 60 * 1000;
    setInterval(() => {
      const q = questions[Math.floor(Math.random() * questions.length)];
      sendMessage(channelId, `❓ **Icebreaker:** ${q}`);
    }, interval);
  }
};
