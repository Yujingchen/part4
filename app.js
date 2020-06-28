const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const config = require('./utils/config')
const app = express();
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('reqBody', function (request, response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :reqBody')
)
app.use('/api/persons', personsRouter)

console.log(config)
const url = config.MONGODB_URI
logger.info('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    logger.info('connected to mongo db')
})
    .catch((error) => {
        logger.info('error connecting to mongoDB: ', error.message)
    })

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app