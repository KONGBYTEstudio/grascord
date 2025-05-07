module.exports.getGameActivity = (member, emojiMap, defaultEmoji) => {
    const activities = member.presence?.activities || [];
    const game = activities.find(a => a.type === 0 && a.name);
    if (game) {
      return { name: game.name, emoji: emojiMap[game.name] || defaultEmoji };
    }
    return { name: null, emoji: defaultEmoji };
  };
  