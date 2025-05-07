// modules/voicejoint.js

const statsTracker = require('./statsTracker');
const { getGameActivity } = require('./presenceTracker');

module.exports = {
  name: 'voicejoint',
  /**
   * Initialisiert den VoiceJoint-Listener.
   * @param {Client} client - Deine Discord.js Client-Instanz
   * @param {object} settings - Die settings.json
   * @param {(channelId: string, content: string) => Promise<void>} sendMessage - Helper-Funktion
   */
  init(client, settings, sendMessage) {
    client.on('voiceStateUpdate', (oldState, newState) => {
      // Nur echte Joins (kein Wechsel im selben Channel)
      if (!newState.channelId || oldState.channelId === newState.channelId) return;

      const member = newState.member;
      const vc      = newState.guild.channels.cache.get(newState.channelId);
      const vcCount = vc.members.size;

      // Game-Emoji & Name aus presenceTracker
      const { emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);

      // Message-Text
      const content = `${emoji} **${member.displayName}** joined **${vc.name}** (👥 ${vcCount}/${settings.maxVCSize})`;

      // Senden (per Bot oder Webhook)
      sendMessage(newState.channelId, content);

      // Stat-Log
      try {
        statsTracker.logJoin(member.id);
      } catch (e) {
        console.error('Stats log failed:', e);
      }
    });
  }
};
