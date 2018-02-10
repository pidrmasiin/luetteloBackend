const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!

require('dotenv').config()

const url = process.env.luetteloDB

mongoose.connect(url)

var name = process.argv[2]
var number = process.argv[3]
const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: name,
  number: number
})


if(name === undefined){
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name + ' ' + person.number)
      })
      mongoose.connection.close()
    })
}else{
  person
    .save()
    .then(response => {
      console.log('lisätään henkilö '+ name + ' numero ' + number
        + ' luetteloon')
      mongoose.connection.close()
    })
}