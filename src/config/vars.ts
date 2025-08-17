import { join } from 'node:path';

const DATA_DIR = join(__dirname, '..', '..', 'data');
const MAX_NUMBER_SUPPORTED = 50;

export const STREAMER_WATCHED_CSV_HEADER_0 = 'streamer_watched';
export const STREAMER_WATCHED_CSV_HEADER_1 = 'user_ids';
export const STREAMER_WATCHED_FILE = join(DATA_DIR, 'streamer-watched.csv');

export const STORE_FILE = join(DATA_DIR, 'store.json');

export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
export const TWITCH_SECRET = process.env.TWITCH_SECRET;
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID ?? '';
export const SECONDARY_USERS_IDS = parseStringArrayEnvVar(process.env.SECONDARY_USERS_IDS);
export const MAX_CHANNELS_ALLOWED: number = validateNumber(process.env.MAX_CHANNELS_ALLOWED);

function parseStringArrayEnvVar(value?: string): string[] {
  if (!value) {
    return [];
  }

  try {
    const raw = JSON.parse(value);
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
}

function validateNumber(value?: string): number {
  if (!value) {
    return 0;
  }

  try {
    const parsed = Number.parseInt(value);

    if (Number.isNaN(parsed)) {
      return 0;
    }

    if (parsed < 0) {
      return 0;
    }

    if (parsed > MAX_NUMBER_SUPPORTED) {
      return MAX_NUMBER_SUPPORTED;
    }

    return parsed;
  } catch (error: unknown) {
    console.error(error);
    return 0;
  }
}
