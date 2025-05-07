// modules/commands/steam.js
const axios = require('axios');

module.exports = {
  name: 'steam',
  displayName: 'SmokeScreen',
  description: 'Zeigt Steam-Spielzeit (CS2) für einen User',
  async execute(message, args) {
    const [username] = args;
    if (!username) return message.reply('Usage: steam <username>');
    try {
      // Vanity → SteamID
      const res1 = await axios.get(
        'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/', {
          params: { key: process.env.STEAM_API_KEY, vanityurl: username }
        }
      );
      const steamId = res1.data.response.steamid;
      // Stats für CS2 (appid 730)
      const res2 = await axios.get(
        'https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/', {
          params: { key: process.env.STEAM_API_KEY, steamid: steamId, appid: 730 }
        }
      );
      const playtime = res2.data.playerstats.stats
        .find(s => s.name === 'total_time_played')?.value || 0;
      message.reply(`CS2-Spielzeit für ${username}: ${playtime} Minuten`);
    } catch (e) {
      console.error(e);
      message.reply('Fehler bei der Steam-API.');
    }
  }
};
