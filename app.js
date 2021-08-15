const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('express-async-errors')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const config = require('./utils/config')

const url = config.MONGODB_URI
logger.info('connected to mongodb')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .catch(error => logger.error('error connecting to MongoDb:', error.message))


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use(express.static('build'))
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/testing', testingRouter)
morgan.token('reqBody', function (request) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :reqBody'))
app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app