class Validator {  
  constructor(word, secret) {
    this.word = word.split('').map((letter) => {
      return letter.toUpperCase()
    })
    this.secret = secret.split('').map((letter) => {
      return letter.toUpperCase()
    })
  }

  validate() {
    const occurences = {}
    const validation = []
    this.word.forEach((letter, ix) => {
      letter = letter.toUpperCase()
      occurences[letter] = typeof occurences[letter] === 'undefined' ? 1 : occurences[letter] + 1

      if(letter === this.secret[ix]) { //Letter is in the right position
        validation[ix] = true
      } else if(this.secret.indexOf(letter) !== -1) {
        if(this.letterCorrectTimes(letter) < this.occurencesOfLetter(letter)) {
          validation[ix] = false
        }
      }
    })
    return validation
  }

  occurencesOfLetter(letter) {
    let count = 0
    this.secret.forEach((l) => {
      if(l === letter) count++
    })
    return count
  }

  letterCorrectTimes(letter) {
    let count = 0
    this.secret.forEach((l, ix) => {
      if(l === this.word[ix] && l === letter) count++
    })
    return count
  }
}
  
module.exports = Validator;