
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const personRouter = require('./controllers/note')
const middleware = require('./utils/middleware')


if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.luetteloDB
mongoose.connect(url)

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.morg)

app.use(express.static('build'))
app.use('/api/persons', personRouter)

app.use(middleware.error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
