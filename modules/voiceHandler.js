const { getGameActivity } = require('./presenceTracker');
const messageSender = require('./messageSender');
const statsTracker = require('./statsTracker');

module.exports.handle = (oldState, newState, client, settings) => {
  const vcId = newState.channelId;
  const member = newState.member;
  const vcChannel = newState.guild.channels.cache.get(vcId);
  const vcCount = vcChannel.members.size;
  const { name, emoji } = getGameActivity(member, settings.emojiMap, settings.defaultEmoji);
  const content = `${emoji} ${name || 'Voice-Join'}\n` +
                  `**${member.displayName}** joined **${vcChannel.name}** ` +
                  `(👥 ${vcCount}/${settings.maxVCSize})`;

  // Nachricht senden
  messageSender.send(client, vcId, content);

  // Stats loggen
  try {
    statsTracker.logJoin(member.id);
  } catch (err) {
    console.error('Stats-Logging fehlgeschlagen:', err);
  }
};
