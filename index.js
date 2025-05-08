// index.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  PermissionFlagsBits
} = require('discord.js');

// JSON manuell laden, statt require()
const settingsPath = path.join(__dirname, 'config', 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

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
    try {
      await axios.post(webhookMap[channelId], { content });
    } catch (e) {
      console.error('Webhook failed:', e);
    }
  } else {
    const ch = client.channels.cache.get(channelId);
    if (ch?.isTextBased()) {
      ch.send(content).catch(console.error);
    }
  }
}

// ─── Stats-Tracker ────────────────────────────────────────────────────────────
const statsTracker = require('./modules/statsTracker');
function logJoin(id) {
  statsTracker.logJoin(id);
}

// ─── Presence-Tracker ─────────────────────────────────────────────────────────
const presence = require('./modules/presenceTracker');

// ─── Fun-Module init ──────────────────────────────────────────────────────────
const Icebreaker     = require('./modules/fun/icebreaker');
const PunEngine      = require('./modules/fun/punEngine');
const RageTracker    = require('./modules/fun/rageTracker');
const ReactionEngine = require('./modules/fun/reactionEngine');

if (settings.modules.icebreaker) {
  Icebreaker.init(client, settings, sendMessage);
}
if (settings.modules.rageTracker) {
  RageTracker.init(client, settings, sendMessage);
}
if (settings.modules.reactionEngine) {
  ReactionEngine.init(client, settings);
}

// ─── Commands laden ───────────────────────────────────────────────────────────
client.commands = new Collection();
for (const file of fs
  .readdirSync(path.join(__dirname, 'modules', 'commands'))
  .filter(f => f.endsWith('.js'))
) {
  const cmd = require(`./modules/commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

// ─── VoiceJoint (togglebar) ──────────────────────────────────────────────────
const VoiceJoint = require('./modules/voicejoint');
if (settings.modules.voicejoint) {
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

  if (command.adminOnly && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
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
if (!settings.modules.voicejoint) {
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
