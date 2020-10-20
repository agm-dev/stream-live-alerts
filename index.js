const Twitch = require('./src/services/Twitch.service')
const Notifier = require('./src/services/Notifier.service')
const {
  twitchClientId,
  twitchSecret,
  streamers,
  mongoUri,
} = require('./src/config/vars')
const { connectToDatabase, disconnectDatabase } = require('./src/config/db')

const twitch = new Twitch({ clientId: twitchClientId, secretId: twitchSecret });

(async () => {
  if (mongoUri) {
    await connectToDatabase()
  }

  const streams = await twitch.getLiveStreams(streamers)
  console.log('twitch streams:', streams)

  await Notifier.process(streams)

  if (mongoUri) {
    disconnectDatabase()
  }
})()
