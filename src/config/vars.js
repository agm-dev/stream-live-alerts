const fs = require('fs')
const { join } = require('path')

require('dotenv-safe').config({
  example: join(__dirname, '..', '..', '.env.example'),
  path: join(__dirname, '..', '..', '.env'),
})

const jsonContent = fs.readFileSync(join(__dirname, 'streamers.json'), 'utf-8')
const data = JSON.parse(jsonContent)
const { streamers } = data

module.exports = {
  streamers,
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramUserId: process.env.TELEGRAM_USER_ID,
}
