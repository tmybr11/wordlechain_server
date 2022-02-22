const args = require('yargs').argv;
const connection = require('../db/mongo')

const word = args.word

connection.connectToServer((db) => {
  db.collection('words').createIndex({ rnd: 1 }, {
    unique: true
  })

  db.collection('words').findOne({
    text: word
  }).then((existingWord) => {
    if(!existingWord) {
      db.collection('words').insertOne({
        text: word,
        rnd: Math.random()
      }).then(() => {
        console.log(`Word ${word} added to the words collection`)
        process.exit()
      }).catch((err) => {
        console.log(`Something was wrong: ${err}`)
        process.exit()
      })
    } else {
      console.log(`Word ${word} already exists in the words collection`)
      process.exit()
    }
  })
})