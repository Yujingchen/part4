const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request) => {
    logger.info('Method', request.method)
    logger.info('Path', request.path)
    logger.info('Body', request.body)
    logger.info('---')
}

const errorHandler = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        return res.status(400).send({ 'error': error.message })
    }
    if (error.name === 'TypeError') {
        return res.status(400).send({ 'error': 'malformatted id' })
    }
    else if (error.name === 'CastError') {
        return res.status(400).send({ 'error': 'malformatted id', 'message': error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'invalid token'})    
    }
    else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'token expired'})
    }
    else if (error.name === 'SyntaxError') {
        return res.status(400).send({'error': error.message})
    }
    next(error)
}

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: 'Unknown end point' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

const userExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        // eslint-disable-next-line no-undef
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = decodedToken
        req.user = user
    }
    next()
}
module.exports = {
    requestLogger,
    errorHandler,
    unknownEndPoint,
    tokenExtractor,
    userExtractor
}