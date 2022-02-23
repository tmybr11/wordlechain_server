const express = require('express')
const app = express()
const port = 3030
const connection = require('./db/mongo')
const Validator = require('./classes/Validator')

app.get('/validate', (req, res) => {
  res.header("Access-Control-Allow-Origin", '*')
  connection.connectToServer((db) => {
    db.collection('daily_words').findOne({
      current: true
    }).then((currentWord) => {
      res.send(new Validator(req.query.word, currentWord.word).validate())
    })
  })
})

app.listen(port, () => {
})