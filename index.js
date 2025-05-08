// index.js

require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  PermissionFlagsBits
} = require('discord.js');
const settings = require('./config/settings.json');

// Prefixes
const PREFIXES = ['!', '/'];

// ─── Client & Intents ─────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ─── Webhooks (optional) ──────────────────────────────────────────────────────
let webhookMap = {};
if (process.env.USE_WEBHOOKS === 'true' && process.env.CHANNELS_WEBHOOKS) {
  webhookMap = Object.fromEntries(
    process.env.CHANNELS_WEBHOOKS.split(',').map(p => p.split('='))
  );
}
async function sendMessage(channelId, content) {
  if (webhookMap[channelId]) {
    try { await axios.post(webhookMap[channelId], { content }); }
    catch (e) { console.error('Webhook failed:', e); }
  } else {
    const ch = client.channels.cache.get(channelId);
    if (ch?.isTextBased()) {
      ch.send(content).catch(console.error);
    }
  }
}

// ─── Stats-Tracker ────────────────────────────────────────────────────────────
const statsTracker = require('./modules/statsTracker');
function logJoin(id) { statsTracker.logJoin(id); }

// ─── Presence-Tracker ─────────────────────────────────────────────────────────
const presence = require('./modules/presenceTracker');

// ─── Commands laden ───────────────────────────────────────────────────────────
client.commands = new Collection();
for (const file of fs.readdirSync('./modules/commands').filter(f => f.endsWith('.js'))) {
  const cmd = require(`./modules/commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

// ─── VoiceJoint (togglebar) ──────────────────────────────────────────────────
const VoiceJoint = require('./modules/voicejoint');
if (settings.modules.voicejoint === true) {
  VoiceJoint.init(client, settings, sendMessage);
}

// ─── Ready-Event ──────────────────────────────────────────────────────────────
client.once('ready', () => {
  console.log(`GrasCord ready as ${client.user.tag}`);
  statsTracker.scheduleWeekly(client);
});

// ─── Message-Handler für Text-Commands ────────────────────────────────────────
client.on('messageCreate', message => {
  const prefix = PREFIXES.find(p => message.content.startsWith(p));

  // merged nested ifs: Bot-Autoreply + fehlender Prefix
  if (message.author.bot || !prefix) {
    return;
  }

  console.log(`[MSG] ${message.author.tag}: ${message.content}`);

  const [name, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  console.log(`[CMD] erkannt: ${name}`, args);

  const command = client.commands.get(name.toLowerCase());
  if (!command) {
    return;
  }

  // merged nested if: Admin-Flag und fehlende Rechte
  if (command.adminOnly === true && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return message.reply('Du brauchst Admin-Rechte.');
  }

  try {
    command.execute(message, args, client, settings, sendMessage);
  } catch (err) {
    console.error('Command-Error:', err);
    message.reply('Fehler beim Ausführen des Befehls.');
  }
});

// ─── Fallback Voice Joins, wenn VoiceJoint deaktiviert ────────────────────────
if (settings.modules.voicejoint !== true) {
  client.on('voiceStateUpdate', (oldState, newState) => {
    if (!newState.channelId || oldState.channelId === newState.channelId) {
      return;
    }

    const { member, guild } = newState;
    const vc = guild.channels.cache.get(newState.channelId);
    const vcCount = vc.members.size;
    const { emoji } = presence.getGameActivity(
      member,
      settings.emojiMap,
      settings.defaultEmoji
    );

    const content = `${emoji} **${member.displayName}** joined **${vc.name}** (👥 ${vcCount}/${settings.maxVCSize})`;
    sendMessage(newState.channelId, content);
    logJoin(member.id);
  });
}

// ─── Bot einloggen ───────────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
