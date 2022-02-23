const cron = require('node-cron')
const connection = require('../db/mongo')

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

cron.schedule('* * * * *', function() {
  connection.connectToServer((db) => {
    db.collection('daily_words').findOne({
      current: true
    }).then((currentWord) => {
      if(currentWord) {
        if(((new Date().getTime() - currentWord.timestamp) > MINUTE)) {
          db.collection('daily_words').updateOne({
            current: true
          }, {
            $set: {
              current: false
            }
          }).then(() => {
            db.collection('words').findOne({
              rnd: {
                $gte: Math.random()
              }
            }).then((word) => {
              db.collection('daily_words').insertOne({
                word: word.text,
                current: true,
                timestamp: new Date().getTime()
              })
            })
          })
        }
      } else {
        db.collection('words').findOne({
          rnd: {
            $gte: Math.random()
          }
        }).then((word) => {
          db.collection('daily_words').insertOne({
            word: word.text,
            current: true,
            timestamp: new Date().getTime()
          })
        })
      }
    })
  })
})