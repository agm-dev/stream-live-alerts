
import { Telegram } from 'telegraf';
import { TELEGRAM_TOKEN, TELEGRAM_USER_ID } from '../config/vars';

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
