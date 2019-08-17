const Telegram = require('./Telegram.service')
const {
  telegramUserId,
} = require('../config/vars')
const {
  liveStreamers,
  saveStreamers,
} = require('../config/store')

const formatStreamData = data => ({
  user_name: data.user_name.replace(/ /img, '').toLowerCase(),
  title: data.title,
  started_at: data.started_at,
})

const calculateHours = stringDate => {
  const startedAt = new Date(stringDate).getTime()
  const now = new Date().getTime()
  const diff = now - startedAt
  return Math.floor(diff / (1000 * 60 * 60))
}

class Notifier {
  static process(streams) {
    const formatted = streams.map(formatStreamData)

    const streamingNow = formatted.filter(stream => {
      const isOnSavedOnes = liveStreamers.some(i => i.user_name === stream.user_name)
      return !isOnSavedOnes
    })
    this.notify(streamingNow, true)

    const endedStream = liveStreamers.filter(stream => {
      const isOnCurrent = formatted.some(i => i.user_name === stream.user_name)
      return !isOnCurrent
    })
    this.notify(endedStream, false)

    saveStreamers(formatted)
  }

  static notify(streams = [], starting = true) {
    streams.forEach(stream => {
      const { user_name, title, started_at } = stream
      const hours = calculateHours(started_at)
      const text = starting ?
        `${user_name} is on streaming now!\n\n${title}\n\nhttps://twitch.tv/${user_name}` :
        `${user_name} streaming has finished.\n\n${user_name} has been streaming during ${hours} hours`

        this.send(text)
          .then(response => console.log('send notification response: ', response))
          .catch(err => console.log('error on sending notification: ', err))
    })
  }

  static send(message) {
    return Telegram.send(telegramUserId, message)
  }
}

module.exports = Notifier
