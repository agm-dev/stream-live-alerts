const fs = require('fs')
const { join } = require('path')
const { mongoUri } = require('./vars')
const Storage = require('../models/Storage')

const storePath = join(__dirname, '..', 'storage', 'store.json')

let liveStreamers = []
let token = {}

if (mongoUri) {
  Storage.findOne({})
    .then(document => {
      console.log("DEBUG find document", document)
      if (!document) {
        return
      }
      liveStreamers = document.liveStreamers
      token = document.token
    })
    .catch(err => console.log('error on getting data from mongodb'))
} else {
  try {
    const jsonContent = fs.readFileSync(storePath, 'utf-8')
    const data = JSON.parse(jsonContent)
    liveStreamers = data.liveStreamers
    token = data.token
  } catch (err) {
    console.log('there is no saved data in the store')
  }
}

const updateDocument = () => Storage
  .findOneAndUpdate({}, { liveStreamers, token }, { upsert: true })
  .catch(err => console.log('error on find and update document', err))

const saveStreamers = async streamers => {
  liveStreamers = streamers
  if (mongoUri) {
    await updateDocument()
  } else {
    const data = JSON.stringify({ liveStreamers, token }, null, 2)
    try {
      fs.writeFileSync(storePath, data, 'utf-8')
    } catch (err) {
      console.log('error on saving data', err)
    }
  }
}

const saveToken = async newToken => {
  token = newToken
  if (mongoUri) {
    await updateDocument()
  } else {
    const data = JSON.stringify({ liveStreamers, token }, null, 2)
    try {
      fs.writeFileSync(storePath, data, 'utf-8')
    } catch (err) {
      console.log('error on saving data', err)
    }
  }
}

const getToken = () => token.access_token

const getLiveStreamers = () => liveStreamers

module.exports = {
  getLiveStreamers,
  saveStreamers,
  getToken,
  saveToken,
}
