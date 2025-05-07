// modules/commands/summon.js
module.exports = {
    name: 'summon',
    displayName: 'KiffKonnekt',
    description: 'Ping alle im VC: Zeit zum Joint!',
    execute(message) {
      const channel = message.member.voice.channel;
      if (!channel) return message.reply('Du bist in keinem VC.');
      const mentions = channel.members
        .filter(m => !m.user.bot)
        .map(m => `<@${m.id}>`)
        .join(' ');
      message.channel.send(`🌿 Zeit zum Joint! ${mentions}`);
    }
  };
  