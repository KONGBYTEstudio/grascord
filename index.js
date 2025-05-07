require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const settings = require('./config/settings.json');
const voiceHandler = require('./modules/voiceHandler');
const statsTracker = require('./modules/statsTracker');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`GrasCord ready as ${client.user.tag}`);
  // Starte das wöchentliche Leaderboard
  statsTracker.scheduleWeekly(client);
});

// Hier hören wir auf **alle** Voice-Channel Joins
client.on('voiceStateUpdate', (oldState, newState) => {
  // Wenn jemand einem beliebigen VC beitritt
  if (newState.channelId && oldState.channelId !== newState.channelId) {
    voiceHandler.handle(oldState, newState, client, settings);
  }
});

client.login(process.env.DISCORD_TOKEN);
