const http = require('http')

const express = require('express')
const app = express()
var morgan = require('morgan')

const bodyParser = require('body-parser')

const cors = require('cors')
var path = require('path')

const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}





app.use(bodyParser.json())

app.use(cors())

app.use(logger)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

const info = () => {
  return(
    "Puhelinluettelossa on " + persons.length + " henkilöä" + 
    "<br><br>" + 
    new Date()
  )
}



app.get('/api/persons', (req, res) => {
  res.json(persons)
})


app.get('/info', (req, res) => {
  res.send(info())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if( person ){
    res.json(person)
  } else {
    res.status(404).end()
  }
}) 

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const one = persons.find(x => x.name === body.name)
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'name or number missing'})
  }if (one) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(10000000000))
  }
  persons = persons.concat(person)
  response.json(person)
})




const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
