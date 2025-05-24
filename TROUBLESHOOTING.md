# GrasCord Bot - Startup and Troubleshooting Guide

This guide will help you set up and run the GrasCord bot, and troubleshoot common issues.

## 1. Prerequisites

*   **Node.js:** Ensure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/). GrasCord is developed with Node.js v18+ in mind, but `discord.js` v14 (a core dependency) generally works well with Node.js v16.9.0 or newer.

## 2. Setup

### a. Cloning the Repository (Optional)

If you haven't already, clone the repository to your local machine:

```bash
git clone <repository_url>
cd <repository_directory>
```
(You likely already have the code if you are reading this within the repository).

### b. Create `.env` File (Crucial!)

The bot requires a `.env` file in its root directory to store your Discord bot token and other sensitive configurations. This file is **essential** for the bot to connect to Discord.

1.  Create a new file named `.env` in the root of the project.
2.  Add your Discord bot token to it:

    ```env
    DISCORD_TOKEN=YOUR_ACTUAL_DISCORD_BOT_TOKEN_HERE
    ```

    Replace `YOUR_ACTUAL_DISCORD_BOT_TOKEN_HERE` with your bot's actual token from the [Discord Developer Portal](https://discord.com/developers/applications).

    **Example `.env` content:**

    ```env
    DISCORD_TOKEN=MTAxMjM0NTY3ODkwMTIzNDU2Ny5HWApHVTkuQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo
    # You can also add other optional variables here, for example:
    # USE_WEBHOOKS=true
    # OWNER_ID=YOUR_DISCORD_USER_ID
    ```

    **Important:** Keep your `DISCORD_TOKEN` secret. Do not share it publicly or commit the `.env` file to version control if you're managing your own fork. The provided `.gitignore` should already exclude `.env`.

### c. Install Dependencies

Open your terminal or command prompt in the bot's root directory and run:

```bash
npm install
```

This command will download and install all the necessary packages defined in `package.json`.

## 3. Running the Bot

You have two main options for running the bot:

*   **Standard Startup:**

    ```bash
    npm start
    ```
    This will typically run the bot using `node src/index.js`.

*   **Development Mode (with `nodemon`):**

    If you have `nodemon` installed (or it's a dev dependency), you can use:

    ```bash
    npm run dev
    ```
    `nodemon` will automatically restart the bot whenever you make changes to the code, which is very helpful during development. If `nodemon` is not installed globally, you might need to run `npm install nodemon --save-dev` first, or if it's a project dependency, `npm run dev` should work out of the box.

## 4. Expected Behavior on Startup

Upon successful startup, you should see a message in your console similar to:

```
GrasCord ready as YourBotTag#1234
```

Replace `YourBotTag#1234` with your bot's actual Discord username and discriminator.

## 5. Basic Functionality Test

Once the bot is running and shows the "ready" message:

1.  Go to a Discord server where the bot is a member and has permission to read and send messages in a specific channel.
2.  Send a help command:
    *   `!help` (if using prefix commands)
    *   `/help` (if slash commands are registered and preferred)

3.  **Expected Response:** The bot should respond with a list of available commands or a help message. The exact output can vary based on the bot's current command configuration.

## 6. Troubleshooting Tips

### a. Bot Not Starting / Crashing Immediately

*   **Check `DISCORD_TOKEN` in `.env`:**
    *   Ensure the `.env` file exists in the root directory of the project.
    *   Verify the `DISCORD_TOKEN` is correct and valid.
    *   Make sure there are no extra spaces or characters before or after the token.
    *   Ensure the line is exactly `DISCORD_TOKEN=YOUR_TOKEN_HERE`.
*   **Ensure All Dependencies Installed:**
    *   Run `npm install` again to make sure all packages were downloaded and installed correctly. Look for any errors during the installation process.
*   **Check Node.js Version Compatibility:**
    *   While `discord.js` v14 is fairly modern, extremely old Node.js versions might cause issues. Ensure you're running Node.js v16.9.0 or newer. You can check your Node.js version with `node -v`.

### b. Bot Starts but Commands Don't Work

*   **Check Bot Permissions on Discord Server:**
    *   **Read Messages:** The bot needs permission to see messages in the channel you're testing in.
    *   **Send Messages:** The bot needs permission to send replies.
    *   **Use Application Commands:** For slash commands to work, ensure the bot has the "Use Application Commands" permission.
    *   **Voice Permissions:** If testing voice-related commands, ensure the bot has "Connect" and "Speak" permissions in the relevant voice channels.
*   **Check Prefixes:**
    *   Ensure you are using the correct command prefix (e.g., `!`) if testing prefix-based commands.
    *   For slash commands (`/`), ensure they have been registered correctly (this usually happens on bot startup or via a specific registration script).
*   **Look for Errors in Console:**
    *   When you send a command, check the bot's console output for any error messages. These messages are crucial for diagnosing the problem.

### c. Voice Join/Leave Messages Not Appearing

*   **Check `settings.json` for Voice Module:**
    *   Ensure the `modules.voicejoint` setting is `true` in your `config/settings.json` file. Example:
        ```json
        {
          "modules": {
            "voicejoint": true,
            // ... other modules
          },
          // ... other settings
        }
        ```
*   **Webhook Configuration (if `USE_WEBHOOKS=true`):**
    *   If you have `USE_WEBHOOKS=true` in your `.env` file:
        *   Ensure `CHANNELS_WEBHOOKS` in `config/settings.json` is correctly configured with valid webhook URLs for the channels where you expect these messages.
        *   Verify the webhooks themselves are valid and haven't been deleted from your Discord server.
*   **Bot Permissions (if not using webhooks):**
    *   If `USE_WEBHOOKS` is `false` or not set, the bot sends messages directly.
    *   Ensure the bot has "Send Messages" permission in the voice channels themselves (if your server settings allow sending messages in voice channels) or in the linked text channel if your server is configured that way. Some servers might have specific text channels designated for bot commands or notifications related to voice channel activity.

### d. Data Not Saving (e.g., for Stats or Puns)

*   **File System Permissions:**
    *   The bot needs write permissions for the `data/` directory (e.g., for `guildsData.json`, `usersData.json`, `stats.json`) and potentially for the `config/settings.json` file if any commands modify it.
    *   Ensure the user running the bot process has the necessary write permissions in the file system where the bot is located. This is especially relevant if running the bot on a server or in a containerized environment.

## 7. Log Files/Console Output

**Checking the console output is the primary way to diagnose issues.**

*   When the bot starts, look for the "GrasCord ready..." message.
*   If the bot crashes, the console will usually display an error message indicating the cause (e.g., invalid token, code error, missing dependency).
*   When commands are processed (or fail to process), relevant information or error messages are often logged to the console.
*   Pay close attention to any lines that start with `Error:`, stack traces (lines showing file paths and line numbers), or specific messages from the `discord.js` library.

By carefully reviewing the console output, you can often pinpoint the source of the problem and apply the appropriate fix from the troubleshooting tips above.
