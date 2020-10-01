const fs = require('fs')
const { join } = require('path')

const hasDb = require('../utils/hasDb')
const MongoLib = require('../lib/mongo')

const mongo = new MongoLib()

const storePath = join(__dirname, '..', 'storage', 'store.json')
const streamersCollection = 'liveStreamers'
const tokenCollection = 'token'

let liveStreamers = []
let token = {}

try {
  const jsonContent = fs.readFileSync(storePath, 'utf-8')
  const data = JSON.parse(jsonContent)
  liveStreamers = data.liveStreamers
  token = data.token
} catch (err) {
  console.log('there is no saved data in the store')
}

const saveStreamers = async (streamers) => {
  const data = JSON.stringify({ liveStreamers: streamers, token }, null, 2)
  try {
    if (hasDb) {
      await mongo.create(streamersCollection, streamers)
    } else {
      fs.writeFileSync(storePath, data, 'utf-8')
    }
  } catch (err) {
    console.log('error on saving data', err)
  }
}

const saveToken = async (newToken) => {
  token = newToken
  const data = JSON.stringify({ liveStreamers, token: newToken }, null, 2)
  try {
    if (hasDb) {
      await mongo.create(tokenCollection, [token])
    } else {
      fs.writeFileSync(storePath, data, 'utf-8')
    }
  } catch (err) {
    console.log('error on saving data', err)
  }
}

const getToken = () => token.access_token

module.exports = {
  liveStreamers,
  saveStreamers,
  getToken,
  saveToken,
}
