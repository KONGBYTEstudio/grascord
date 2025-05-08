// modules/voicejoint.js
const statsTracker = require('./statsTracker');
const { getGameActivity } = require('./presenceTracker');

module.exports = {
  name: 'voicejoint',

  /**
   * Initialisiert den VoiceJoint-Listener.
   * @param {Client} client
   * @param {object} settings
   * @param {function} sendMessage
   */
  init(client, settings, sendMessage) {
    client.on('voiceStateUpdate', (oldState, newState) => {
      if (!newState.channelId || oldState.channelId === newState.channelId) {
        return;
      }

      const { member, guild } = newState;
      const vc = guild.channels.cache.get(newState.channelId);
      const vcCount = vc.members.size;
      const { emoji } = getGameActivity(
        member,
        settings.emojiMap,
        settings.defaultEmoji
      );

      const content = `${emoji} **${member.displayName}** joined **${vc.name}** (👥 ${vcCount}/${settings.maxVCSize})`;
      sendMessage(newState.channelId, content);

      try {
        statsTracker.logJoin(member.id);
      } catch (e) {
        console.error('Stats log failed:', e);
      }
    });
  }
};
