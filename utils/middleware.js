const logger = require("./logger")


const requestLogger = (request, response, next) => {
    logger.info('Method', request.method);
    logger.info('Path', request.path);
    logger.info('Body', request.body);
    logger.info('---');
}

const errorHandler = (error, req, res, next) => {
    if (error.name === "ValidationError") {
        res.status(400).send({ "error": error.message })
        logger.info(error)
    }
    else if (error.name === "CastError") {
        res.status(400).send({ "error": "malformatted id" })
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        })
    }
    next(error)
}

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: "Unknown end point" })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndPoint,
    tokenExtractor
}