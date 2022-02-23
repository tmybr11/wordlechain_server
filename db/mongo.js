require('dotenv').config({ path: '../.env' })
const { MongoClient } = require('mongodb');
const connectionString = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db('wordlechain');

      return callback(dbConnection);
    });
  },

  getDb: function () {
    return dbConnection;
  },
};