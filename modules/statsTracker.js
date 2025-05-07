const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/vcStats.json');

// Stats initial laden (oder leeres Objekt)
let stats = {};
try {
  if (fs.existsSync(dataPath)) {
    stats = JSON.parse(fs.readFileSync(dataPath));
  }
} catch {
  stats = {};
}

module.exports.logJoin = userId => {
  stats[userId] = (stats[userId] || 0) + 1;
  fs.writeFileSync(dataPath, JSON.stringify(stats, null, 2));
};

module.exports.scheduleWeekly = client => {
  const channelId = process.env.VC_CHANNEL_ID;
  setInterval(() => {
    const top = Object.entries(stats)
      .sort((a,b) => b[1] - a[1])
      .slice(0,3);
    let msg = '🥇 **Top Talker der Woche**\n';
    top.forEach(([id,cnt], i) => {
      const medal = ['🥇','🥈','🥉'][i];
      const user = client.users.cache.get(id)?.username || id;
      msg += `${medal} ${user}: ${cnt} Joins\n`;
    });
    client.channels.cache.get(channelId).send(msg);
  }, 7 * 24 * 60 * 60 * 1000);
};
