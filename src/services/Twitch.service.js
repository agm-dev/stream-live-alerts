const fetch = require('node-fetch')

class Twitch {
  constructor({ clientId }) {
    this.clientId = clientId
  }

  getLiveStreams(streamers = []) {
    if (!streamers.length) {
      console.log('required streamers data to get streams')
      return
    }

    const queryString = streamers
      .map(item => `user_login=${encodeURI(item)}`)
      .join('&')

    const url = `https://api.twitch.tv/helix/streams?${queryString}`
    const headers = { 'Client-ID': this.clientId }
    const options = { method: 'GET', headers }

    return fetch(url, options)
      .then(response => response.json())
      .then(streams => streams.data.filter(item => item.type === 'live'))
      .catch(err => {
        console.log('error on getLiveStreams request', err)
        return []
      })
  }
}

module.exports = Twitch
