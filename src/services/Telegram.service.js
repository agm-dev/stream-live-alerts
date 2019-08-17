const TelegramAPI = require('telegraf/telegram')
const {
  telegramToken,
} = require('../config/vars')

const api = new TelegramAPI(telegramToken, {
  agent: null,
  webhookReply: false,
})

class Telegram {
  static send(id, text) {
    return api.sendMessage(id ,text)
  }
}

module.exports = Telegram
