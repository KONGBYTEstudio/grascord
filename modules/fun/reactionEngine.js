// modules/fun/reactionEngine.js

const settings = require('../../config/settings.json');
const axios = require('axios');

const defaultReacts = ['😂', '🔥', '💯', '🤣', '👍'];
const defaultGifs = [
  'https://media.giphy.com/media/l0MYA4wRUiTiJVp6I/giphy.gif',
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
];

module.exports = {
  name: 'reactionEngine',

  /**
   * Streut nach Zufallsprinzip Emojis oder GIFs in Text-Channels.
   * @param {Client} client
   * @param {object} settings
   */
  init(client, settings) {
    client.on('messageCreate', message => {
      if (message.author.bot) {
        return;
      }

      // React-Wahrscheinlichkeit
      const chance = typeof settings.reactChance === 'number'
        ? settings.reactChance
        : 0.05;
      if (Math.random() > chance) {
        return;
      }

      // Emoji oder GIF?
      if (Math.random() < 0.7) {
        const reacts = Array.isArray(settings.reactions) && settings.reactions.length
          ? settings.reactions
          : defaultReacts;
        const emo = reacts[Math.floor(Math.random() * reacts.length)];
        message.react(emo).catch(console.error);
      } else {
        const gifs = Array.isArray(settings.reactionGifs) && settings.reactionGifs.length
          ? settings.reactionGifs
          : defaultGifs;
        const url = gifs[Math.floor(Math.random() * gifs.length)];
        message.channel.send(url).catch(console.error);
      }
    });
  }
};
