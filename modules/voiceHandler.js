// modules/voicejoint.js

import statsTracker from './statsTracker';
import { getGameActivity } from './presenceTracker';

export default {
  name: 'voicejoint',
  init(client, settings, sendMessage) {
    client.on('voiceStateUpdate', (oldState, newState) => {
      // 1) Join-Event
      if (!oldState.channelId && newState.channelId) {
        const { member } = newState;
        const vc      = newState.guild.channels.cache.get(newState.channelId);
        const vcCount = vc.members.size;
        const { emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);
        const content = `${emoji} **${member.displayName}** joined **${vc.name}** (👥 ${vcCount}/${settings.maxVCSize})`;

        sendMessage(newState.channelId, content)
          .then(() => statsTracker.logJoin(member.id))
          .catch(e => console.error('Send failed:', e));

        return;
      }

      // 2) Leave-Event
      if (oldState.channelId && !newState.channelId) {
        const { member } = oldState;
        // Hier kein Game-Emoji, einfach Taunt optional
        statsTracker.logLeave(member.id);
        return;
      }

      // 3) Channel-Switch (optional als Join+Leave)
      if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        // Simuliere Leave
        statsTracker.logLeave(oldState.member.id);
        // Und dann Join
        const { member } = newState;
        const vc = newState.guild.channels.cache.get(newState.channelId);
        const vcCount = vc.members.size;
        const { emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);
        const content = `${emoji} **${member.displayName}** switched to **${vc.name}** (👥 ${vcCount}/${settings.maxVCSize})`;

        sendMessage(newState.channelId, content)
          .then(() => statsTracker.logJoin(member.id))
          .catch(e => console.error('Send failed:', e));
      }
        });
  }
};
