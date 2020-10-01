const { MongoClient } = require('mongodb')
const { dbUser, dbPassword, dbHost, dbName } = require('../config/vars')

const DB_USER = encodeURIComponent(dbUser)
const DB_PASSWORD = encodeURIComponent(dbPassword)
const DB_HOST = encodeURIComponent(dbHost)
const DB_NAME = dbName
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this.dbName = DB_NAME
  }

  connection() {
    return new Promise((resolve, reject) => {
      this.client.connect((error) => {
        if (error) {
          reject(error)
        }
        console.log('Connect to mongo')
        resolve(this.client.db(this.dbName))
      })
    })
  }

  create(collection, data) {
    return this.connection().then(async (db) => {
      try {
        const result = await db.collection(collection).insertMany(data)
        this.client.close()
        return result
      } catch (error) {
        this.client.close()
        return error
      }
    })
  }

  update(collection, data) {
    return this.connection().then(async (db) => {
      try {
        const result = await db
          .collection(collection)
          .updateMany(
            { token_type: data.token_type },
            { $set: data },
            { upsert: true, multi: false }
          )
        this.client.close()
        return result
      } catch (error) {
        this.client.close()
        return error
      }
    })
  }
}

module.exports = MongoLib
