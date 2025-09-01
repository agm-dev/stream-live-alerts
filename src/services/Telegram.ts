
import { Telegram, Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN, TELEGRAM_USER_ID, SECONDARY_USERS_IDS, MAX_CHANNELS_ALLOWED } from '../config/vars';
import { addWatchedStreamer, getUserSettingsFromFile, getWatchedStreamers, removeWatchedStreamer, updateUserSettings, userCanSubscribeToMoreChannels } from '../config/store';
import { getLiveStreams } from './Twitch';

const validUsers = [TELEGRAM_USER_ID, ...SECONDARY_USERS_IDS];

const telegramApi = new Telegram(TELEGRAM_TOKEN ?? '', {
  agent: undefined,
  webhookReply: false,
});

export function sendTelegramMessage(text: string, user_id: string, options?: { disable_notification: boolean }) {
  const disable_notification = options?.disable_notification === true;

  return telegramApi.sendMessage(user_id, text, {
    link_preview_options: {
      is_disabled: true,
    },
    disable_notification,
  });
}

const bot = new Telegraf(TELEGRAM_TOKEN ?? '');

bot.command('watch_channel', async (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const firstArg = ctx.message.text.split(' ')?.[1]?.toLowerCase();

  if (!firstArg) {
    ctx.reply('That command requieres a param');
    return;
  }

  const channel = firstArg.trim();

  if (!userCanSubscribeToMoreChannels(user_id)) {
    ctx.reply(`You have reached the max number of subscriptions ${MAX_CHANNELS_ALLOWED}`);
    return;
  }

  try {
    await getLiveStreams([{ channel, subscribers: [] }]); // just to check if the channel exists
    addWatchedStreamer(channel, user_id);
    ctx.reply(`Channel ${channel} is now being watched.`);
  } catch (error: unknown) {
    if ((error as Error & { code: number })?.code === 400) {
      ctx.reply(`The channel ${channel} doesn't exist.`);
      return;
    }

    ctx.reply(`Error while trying to watch channel ${channel}.`);
    console.error('Error while trying to watch channel:', error);
  }
});

bot.command('stop_watching', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const firstArg = ctx.message.text.split(' ')?.[1]?.toLowerCase();

  if (!firstArg) {
    ctx.reply('That command requieres a param');
    return;
  }

  const channel = firstArg.trim();

  removeWatchedStreamer(channel, user_id);

  ctx.reply(`Removed ${channel} from watching list`);
});

bot.command('show_watched', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const streamers = getWatchedStreamers(user_id);

  ctx.reply([
    'Currently watching:',
    ...streamers,
  ].join('\n'));
});

bot.command('enable_notifications', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const settings = getUserSettingsFromFile();
  const userSettings = settings.find(i => i.userId === user_id);

  const newUserSettings = {
    userId: user_id,
    notifications: true,
    notifyOnEnd: userSettings?.notifyOnEnd ?? false,
  }

  updateUserSettings(newUserSettings);

  ctx.reply('Notifications have been enabled');
});

bot.command('disable_notifications', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const settings = getUserSettingsFromFile();
  const userSettings = settings.find(i => i.userId === user_id);

  const newUserSettings = {
    userId: user_id,
    notifications: false,
    notifyOnEnd: userSettings?.notifyOnEnd ?? false,
  }

  updateUserSettings(newUserSettings);

  ctx.reply('Notifications have been disabled');
});

bot.command('enable_notifications_on_end', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const newUserSettings = {
    userId: user_id,
    notifications: true,
    notifyOnEnd: true,
  }

  updateUserSettings(newUserSettings);

  ctx.reply('You will be notified when a streamer you follow ends their streaming');
});

bot.command('disable_notifications_on_end', (ctx) => {
  const user_id = ctx.message.from.id.toString();

  if (!validUsers.includes(user_id)) {
    ctx.reply('You are not an authorized user :(');
    return;
  }

  const newUserSettings = {
    userId: user_id,
    notifications: true,
    notifyOnEnd: false,
  }

  updateUserSettings(newUserSettings);

  ctx.reply('You only will be notified when a streamer you follow starts streaming');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export function launchTelegramBot() {
  bot.launch();
}
