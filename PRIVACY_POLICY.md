# Privacy Policy for GrasCord Bot

*Last updated: 2025-05-05*

## 1. Introduction

GrasCord Bot („we“, „our“, „us“) respects your privacy. This Privacy Policy explains how we collect, use, and share information when you use the GrasCord Discord Bot.

## 2. Information We Collect

* **User IDs**: Discord user identifiers for message dispatch and stats.
* **Join/Leave Events**: Timestamps and channel IDs for voice channel activity.
* **Presence Data**: Optional game/activity status to generate notifications.
* **Logs**: Aggregated statistics (joins per week) stored in `data/vcStats.json`.

We do **not** store any personal data such as real names, IP addresses, or contact information.

## 3. How We Use Your Information

* To provide bot functionality (voice join messages, stats, commands).
* To generate weekly leaderboards and analytics.
* To improve features based on aggregated, anonymized usage.

## 4. Data Retention

All stats and logs are stored indefinitely in your server’s `data/` folder. You can delete or reset this data at any time by removing `data/vcStats.json`.

## 5. Third-Party Services

We use the following free third-party services:

* **google-tts-api** – for generating TTS audio streams.
* **Discord.js** – for interacting with Discord APIs.
  No user data is sent to any external analytics or marketing platforms.

## 6. Your Rights

* You can request deletion of your stats by clearing the data file.
* You can opt out of weekly leaderboards by setting `USE_WEBHOOKS=false`.

## 7. Contact

For questions or concerns, open an issue on our GitHub: [https://github.com/yourrepo/grascord](https://github.com/yourrepo/grascord)

---

*Hosted via GitHub Pages at:* [https://KONGBYTEstudio.github.io/grascord/PRIVACY\_POLICY.html](https://KONGBYTEstudio.github.io/grascord/PRIVACY_POLICY.html)
