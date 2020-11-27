const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

const mongoose = require("mongoose")
const config = require("./utils/config")
const url = config.MONGODB_URI
const morgan = require("morgan")
require('express-async-errors')
logger.info("connected to mongodb")
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(express.static('build'))
app.use("/api/blogs", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)
app.use("/api/testing", testingRouter)

// const testingRouter = require('./controllers/testing')


morgan.token('reqBody', function (request, response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :reqBody'))

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app