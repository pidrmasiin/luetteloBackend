
const express = require('express')
const app = express()
var morgan = require('morgan')

const bodyParser = require('body-parser')

const cors = require('cors')

const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const Person = require('./models/person')

app.use(bodyParser.json())

app.use(cors())

app.use(logger)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.static('build'))




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



app.get('/api/persons', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})


app.get('/info', (req, res) => {
  Person.
    find({}).
    then(person => {
      res.send(info(person.length))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(formatPerson(person))
    })
    .catch(error => {
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
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

app.post('/api/persons', (request, response) => {
  const body = request.body

  Person
    .find({})
    .then(person => {
      const persons = person.filter(one => one.name === body.name)
      if (body.name === undefined || body.number === undefined) {
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

app.put('/api/persons/:id', (req, res) => {
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


const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
