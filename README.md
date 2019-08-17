# Stream Live Alerts

A NodeJS script that queries Twitch.tv API to get data of your favourite channels, then notifies you when the streaming is live and when it ends using Telegram.

## What do you need?

- Twitch client ID.
- Telegram bot token.
- The Twitch usernames of the streamers you want to track.

### Twitch client ID

You need to go to [Twitch developers portal](https://dev.twitch.tv/), then login and go to your dashboard. Create a new app and get your client ID.

### Telegram Bot Token

You can check [Telegram Bots Documentation](https://core.telegram.org/bots) to know how to create a bot. Then create one by talking with [BotFather](https://telegram.me/botfather). This way you will get your bot's token.

## Installation

You will need to install [NodeJS](https://nodejs.org/es/) and [Git](https://git-scm.com/), of course.

Then exec this in the shell:

```sh
git clone https://github.com/agm-dev/stream-live-alerts.git
cd stream-live-alerts
npm install
cp .env.exmaple .env # copy the .env.example to .env file
```

Edit the `.env` file to fill up the `TWITCH_CLIENT_ID`, the `TELEGRAM_TOKEN`, and the `TELEGRAM_USER_ID`.

If you don't know your Telegram user ID, you can ask to [myidbot](https://telegram.me/myidbot) on Telegram.

To personalize the script open the `stream-live-alerts/src/config/streamers.json` file and add there the ones you want to track:

```json
{
  "streamers": [
    "riotgames",
    "whatever-you-want"
  ]
}
```

After all this configuration just run `node index.js`

The ideal way to run this script is by adding it to cron or schefuled task, so it is executed every 1-2 min.
