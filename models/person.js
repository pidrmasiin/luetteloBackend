const mongoose = require('mongoose')

const url = process.env.luetteloDB
console.log(url)
mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
  })
  
  

  module.exports = Person
  