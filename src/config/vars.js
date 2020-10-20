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
  streamers: streamers.map(i => i.replace(/ /img, '').toLowerCase()),
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  twitchSecret: process.env.TWITCH_SECRET,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramUserId: process.env.TELEGRAM_USER_ID,
  mongoUri: process.env.MONGO_URI,
  mongooseOptions: {
    keepAlive: true, // default since mongoose 5.2.0
    useNewUrlParser: true, // to avoid deprecation warning on mongoose 5.x
    useCreateIndex: true, // to avoid collection.ensureIndex deprecation warning
    useUnifiedTopology: true // new server discover and monitoring engine
  },
}
