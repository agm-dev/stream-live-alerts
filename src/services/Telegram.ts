
import { Telegram, Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN, TELEGRAM_USER_ID } from '../config/vars';
import { addWatchedStreamer, getWatchedStreamers, removeWatchedStreamer } from '../config/store';
import { getLiveStreams } from './Twitch';

const telegramApi = new Telegram(TELEGRAM_TOKEN ?? '', {
  agent: undefined,
  webhookReply: false,
});

export function sendTelegramMessage(text: string) {
  return telegramApi.sendMessage(TELEGRAM_USER_ID, text, {
    link_preview_options: {
      is_disabled: true,
    }
  });
}

const bot = new Telegraf(TELEGRAM_TOKEN ?? '');

bot.command('watch_channel', async (ctx) => {
  const firstArg = ctx.message.text.split(' ')?.[1];

  if (!firstArg) {
    ctx.reply('That command requieres a param');
    return;
  }

  const channel = firstArg.trim();

  try {
    const streams = await getLiveStreams([channel])

    const exists = streams.length && [streams[0].user_name.toLowerCase(), streams[0].user_login.toLowerCase()].includes(channel.toLowerCase());

    if (!exists) {
      ctx.reply(`The channel ${channel} doesn't exist.`);
      return;
    }

    addWatchedStreamer(channel);
    ctx.reply(`Channel ${channel} is now being watched.`);
  } catch (error: unknown) {
    ctx.reply(`Error while trying to watch channel ${channel}.`);
    console.error('Error while trying to watch channel:', error);
  }
});

bot.command('stop_watching', (ctx) => {
  const firstArg = ctx.message.text.split(' ')?.[1];

  if (!firstArg) {
    ctx.reply('That command requieres a param');
    return;
  }

  const channel = firstArg.trim();

  removeWatchedStreamer(channel);

  ctx.reply(`Removed ${channel} from watching list`);
});

bot.command('show_watched', (ctx) => {
  const streamers = getWatchedStreamers();

  ctx.reply([
    'Currently watching:',
    ...streamers,
  ].join('\n'));
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export function launchTelegramBot() {
  bot.launch();
}
