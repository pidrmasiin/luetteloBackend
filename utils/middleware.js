const morgan = require('morgan')
morgan.token('body', function (req) { return JSON.stringify(req.body) })

const morg = morgan(':method :url :response-time :body')

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  morg,
  error
}