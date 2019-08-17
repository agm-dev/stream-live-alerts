const fs = require('fs')
const { join } = require('path')

const storePath = join(__dirname, '..', 'storage', 'store.json')

let liveStreamers = []
try {
  const jsonContent = fs.readFileSync(storePath, 'utf-8')
  const data = JSON.parse(jsonContent)
  liveStreamers = data.liveStreamers
} catch (err) {
  console.log('there is no saved data in the store')
}

const saveStreamers = streamers => {
  const data = JSON.stringify({ liveStreamers: streamers }, null, 2)
  try {
    fs.writeFileSync(storePath, data, 'utf-8')
  } catch (err) {
    console.log('error on saving data', err)
  }
}

module.exports = {
  liveStreamers,
  saveStreamers,
}
