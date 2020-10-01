const { dbUser, dbPassword, dbHost, dbName } = require('../config/vars')

let hasDb = false
if (dbUser && dbPassword && dbHost && dbName) {
  hasDb = true
}

module.exports = hasDb
