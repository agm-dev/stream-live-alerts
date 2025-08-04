import { join } from 'node:path';

const DATA_DIR = join(__dirname, '..', '..', 'data');

export const STREAMER_CHANNELS_FILE = join(DATA_DIR, 'streamer-channels.csv');
export const STREAMER_WATCHED_FILE = join(DATA_DIR, 'streamer-watched.csv');
export const STORE_FILE = join(DATA_DIR, 'store.json');

export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
export const TWITCH_SECRET = process.env.TWITCH_SECRET;
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID ?? '';
