# Stream Live Alerts

A NodeJS script that queries Twitch.tv API to get data of your favourite channels, then notifies you when the streaming is live and when it ends using Telegram.

## What do you need?

- Twitch client ID.
- Telegram bot token.
- The Twitch usernames of the streamers you want to track.

### Twitch client ID

You need to go to [Twitch developers portal](https://dev.twitch.tv/), then login and go to your dashboard. Create a new app and get your client ID and secret.

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

Edit the `.env` file to fill up the `TWITCH_CLIENT_ID`, `TWITCH_SECRET`, `TELEGRAM_TOKEN`, and the `TELEGRAM_USER_ID`. You can also add `SECONDARY_USERS_IDS` if you want to allow other Telegram users to use your bot. This variable is an array of other authorized users ids. They will have a limit of watched channels set by `MAX_CHANNELS_ALLOWED`.

If you don't know your Telegram user ID, you can ask to [myidbot](https://telegram.me/myidbot) on Telegram.

You also need to create the next directories and files:
```
/data
/data/store.json (with content -> {})
/data/streamer-watched.csv
```

Fill up `streamer-watched.csv` with some channels you want to track. You can do this from your Telegram bot, but write the csv header at least:

```
streamer_watched,user_ids
channel1,123
channel2,123;456
```

You can configure your Telegram's bot to add this commands. This script will listen to them:
```
/watch_channel [channel] -> adds the channel to the csv file
/stop_watching [channel] -> removed the channel to the csv file
/show_watched -> prints the list of channels being tracked
```

After all this configuration just run:

```
npm install
npm run build
npm start
```

## Telegram's Bot Commands

```
watch_channel - Adds a channel to watched list
stop_watching - Removes a channel from watched list
show_watched - Displays the list of watching channels
enable_notifications - Enables all notifications
disable_notifications - Disables all notifications
enable_notifications_on_end - Enables notifications when a streaming ends
disable_notifications_on_end - Disables notifications when a streaming ends
```

