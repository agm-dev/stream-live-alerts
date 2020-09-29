const Twitch = require('./src/services/Twitch.service')
const Notifier = require('./src/services/Notifier.service')
const {
  twitchClientId,
  twitchSecret,
  streamers,
} = require('./src/config/vars')

const twitch = new Twitch({ clientId: twitchClientId, secretId: twitchSecret });

(async () => {
  const streams = await twitch.getLiveStreams(streamers)
  console.log('twitch streams:', streams)

  Notifier.process(streams)
})()
