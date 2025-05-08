// modules/voicejoint.js
const stats = require('./statsTracker');
const { getGameActivity } = require('./presenceTracker');

module.exports = {
  name: 'voicejoint',
  init(client, settings, sendMessage) {
    client.on('voiceStateUpdate', (oldS, newS) => {
      const guildId   = newS.guild.id;
      const joinChan  = newS.channelId;
      const leaveChan = oldS.channelId;

      // 1) Join
      if (!leaveChan && joinChan) {
        const member = newS.member;
        const vc     = newS.guild.channels.cache.get(joinChan);
        const { emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);
        sendMessage(joinChan,
          `${emoji} **${member.displayName}** joined **${vc.name}**`
        );
        stats.logJoin(guildId, joinChan, member.id);
        return;
      }

      // 2) Leave
      if (leaveChan && !joinChan) {
        stats.logLeave(oldS.guild.id, leaveChan, oldS.member.id);
        return;
      }

      // 3) Channel-Switch
      if (leaveChan && joinChan && leaveChan !== joinChan) {
        stats.logLeave(oldS.guild.id, leaveChan, oldS.member.id);
        const member = newS.member;
        const vc     = newS.guild.channels.cache.get(joinChan);
        const { emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);
        sendMessage(joinChan,
          `${emoji} **${member.displayName}** switched to **${vc.name}**`
        );
        stats.logJoin(guildId, joinChan, member.id);
      }
    });
  }
};
