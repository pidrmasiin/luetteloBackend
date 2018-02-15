
const personRouter = require('express').Router()
const Person = require('../models/person')

const info = (length) => {
  return('Puhelinluettelossa on '+ length + ' henkilöä' + '<br><br>' + new Date())
}

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

personRouter.get('/', (req, res) => {
  console.log(Person)
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      console.log("moi", persons)
      res.json(persons.map(formatPerson))
    })
})

personRouter.get('/info', (req, res) => {
  Person.
    find({}).
    then(person => {
      res.send(info(person.length))
    })
})

personRouter.get('/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(formatPerson(person))
    })
    .catch(error => {
      res.status(404).end()
    })
})

personRouter.delete('/:id', (request, response) => {
  console.log(request.params.id)
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).send()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

personRouter.post('/', (request, response) => {
  const body = request.body

  Person
    .find({})
    .then(person => {
      const persons = person.filter(one => one.name === body.name)
      if (body.name === undefined || body.name.length < 1 || body.number === undefined || body.number.length < 1) {
        return response.status(400).json({ error: 'name or number missing' })
      }if(persons.length > 0){
        return response.status(400).json({ error: 'name must be unique' })
      }if(Array.isArray(body.number)){
        return response.status(400).json({ error: 'only one number allowed' })
      }else{
        const person = new Person({
          name: body.name,
          number: body.number,
          id: Math.floor(Math.random() * Math.floor(10000000000))
        })
        person
          .save()
          .then(savedPerson => {
            response.json(formatPerson(savedPerson))
          })
      }
    })
})

personRouter.put('/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatePerson => {
      res.json(formatPerson(updatePerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).sen({ error: 'malformatted id' })
    })
})

module.exports = personRouter