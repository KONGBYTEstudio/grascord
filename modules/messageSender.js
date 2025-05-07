module.exports.send = (client, channelId, content) => {
    const channel = client.channels.cache.get(channelId);
    if (channel?.isTextBased()) channel.send(content);
  };
  