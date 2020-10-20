const fetch = require('node-fetch')
const {
  getToken,
  saveToken,
} = require('../config/store')

class Twitch {
  constructor({ clientId, secretId }) {
    this.clientId = clientId
    this.secretId = secretId
  }

  getToken() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.secretId}&grant_type=client_credentials`
    return fetch(url, { method: "POST" })
      .then(response => response.json())
      .then(data => {
        return data
      })
      .catch(error => {
        console.error("ERROR: ", error)
        return {}
      })
  }

  getLiveStreams(streamers = [], end = false) {
    if (!streamers.length) {
      console.log('required streamers data to get streams')
      return
    }

    const queryString = streamers
      .map(item => `user_login=${encodeURI(item)}`)
      .join('&')

    const url = `https://api.twitch.tv/helix/streams?${queryString}`
    const headers = {
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${getToken()}`
    }
    const options = { method: 'GET', headers }

    return fetch(url, options)
      .then(response => response.json())
      .then(async streams => {
        if (streams.status === 401 && !end) {
          const newToken = await this.getToken()
          await saveToken(newToken)
          return this.getLiveStreams(streamers, true)
        }
        return streams.data.filter(item => item.type === 'live')
      })
      .catch(err => {
        console.log('error on getLiveStreams request', err)
        return []
      })
  }
}

module.exports = Twitch
