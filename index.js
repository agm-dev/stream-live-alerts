const Twitch = require('./src/services/Twitch.service')
const Notifier = require('./src/services/Notifier.service')
const {
  twitchClientId,
  streamers,
} = require('./src/config/vars')

const twitch = new Twitch({ clientId: twitchClientId });

(async () => {
  const streams = await twitch.getLiveStreams(streamers)
  console.log('twitch streams streams:', streams)

  Notifier.process(streams)
})()
