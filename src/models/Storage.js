const mongoose = require('mongoose')

const liveStreamerSchema = mongoose.Schema({
  user_name: 'string',
  title: 'string',
  started_at: 'string',
})

const tokenSchema = mongoose.Schema({
  access_token: 'string',
  expires_in: 'number',
  token_type: 'string',
})

const schema = mongoose.Schema({
  liveStreamers: [liveStreamerSchema],
  token: tokenSchema,
})

const Storage = mongoose.model('Storage', schema)

module.exports = Storage
