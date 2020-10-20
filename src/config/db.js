const mongoose = require("mongoose");
const { mongoUri, mongooseOptions } = require("./vars");

mongoose.Promise = Promise;

exports.connectToDatabase = function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUri, mongooseOptions, err => {
      if (err) {
        reject(err);
      } else {
        resolve(mongoose.connection);
      }
    });
  });
};

exports.disconnectDatabase = function disconnectDatabase() {
  return mongoose.connection.close();
};