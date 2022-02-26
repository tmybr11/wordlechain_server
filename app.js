require('dotenv').config()
const axios = require('axios')
const express = require('express')
const app = express()
const port = 3030
const mongo = require('./db/mongo')
const redis = require('./db/redis')
const Validator = require('./classes/Validator')

app.get('/validate', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')

  redis.get(req.query.word, (err, result) => {
    if (err) throw err
    if (!result) {
      axios.get('https://wordsapiv1.p.rapidapi.com/words/' + req.query.word, {
        headers: {
          'x-rapidapi-host': process.env.RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
      }).then(() => {
        redis.set(req.query.word, true, 'EX', 3600, (err) => {
          if (err) throw err
          mongo.connectToServer((db) => {
            db.collection('daily_words').findOne({
              current: true
            }).then((currentWord) => {
              res.send(new Validator(req.query.word, currentWord.word).validate())
            })
          })
        })
      }).catch(() => {
        redis.set(req.query.word, false, 'EX', 3600, (err) => {
          if (err) throw err
          res.send('This word does not exist!')
        })
      })
    } else {
      if(result === 'true') {
        mongo.connectToServer((db) => {
          db.collection('daily_words').findOne({
            current: true
          }).then((currentWord) => {
            res.send(new Validator(req.query.word, currentWord.word).validate())
          })
        })
      } else {
        res.send('This word does not exist!')
      }
    }
  })
})

app.listen(port, () => {
})