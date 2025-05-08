// modules/statsTracker.js
const fs   = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/vcStats.json');

// Laden oder leeres Objekt
let stats = {};
try {
  if (fs.existsSync(dataPath)) {
    stats = JSON.parse(fs.readFileSync(dataPath));
  }
} catch {
  stats = {};
}

// Speichern-Helfer
function save() {
  fs.writeFileSync(dataPath, JSON.stringify(stats, null, 2));
}

/**
 * Loggt einen Join in Guild → Channel → increment joins und set lastJoin für den User.
 */
module.exports.logJoin = (guildId, channelId, userId) => {
  // sicherstellen, dass die Strukturen existieren
  stats[guildId] = stats[guildId] || {};
  stats[guildId][channelId] = stats[guildId][channelId] || {
    joins: 0,
    totalTime: 0,
    lastJoinTimestamps: {}
  };

  const node = stats[guildId][channelId];
  node.joins += 1;
  node.lastJoinTimestamps[userId] = Date.now();
  save();
};

/**
 * Loggt einen Leave in Guild → Channel → rechnet Dauer und addiert totalTime.
 */
module.exports.logLeave = (guildId, channelId, userId) => {
  const channelStats = stats[guildId]?.[channelId];
  if (!channelStats) return;
  const last = channelStats.lastJoinTimestamps[userId];
  if (!last) return;

  const duration = Date.now() - last;
  channelStats.totalTime += duration;
  delete channelStats.lastJoinTimestamps[userId];
  save();
};

/**
 * Beispiel: liefert Top-Channels im gesamten Objekt (guildId, channelId, joins)
 */
module.exports.getTopChannels = (limit = 5) => {
  const arr = [];
  for (const [gId, channels] of Object.entries(stats)) {
    for (const [cId, data] of Object.entries(channels)) {
      arr.push({ guildId: gId, channelId: cId, joins: data.joins, totalTime: data.totalTime });
    }
  }
  return arr.sort((a, b) => b.joins - a.joins).slice(0, limit);
};

// Weekly-Job und weitere Funktionen bleiben hier…
module.exports.scheduleWeekly = (client) => {
  const channelId = process.env.VC_CHANNEL_ID;
  setInterval(() => {
    const top = module.exports.getTopChannels(3);
    let msg = '🏆 **Top Channels der Woche**\n';
    top.forEach((c, i) => {
      const medal = ['🥇','🥈','🥉'][i];
      const name  = client.guilds.cache.get(c.guildId)
                          ?.channels.cache.get(c.channelId)
                          ?.name || c.channelId;
      msg += `${medal} #${name}: ${c.joins} Joins, ${Math.floor(c.totalTime/60000)}min\n`;
    });
    client.channels.cache.get(channelId)?.send(msg).catch(console.error);
  }, 7*24*60*60*1000);
};
