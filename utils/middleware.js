const logger = require("./logger")

const errorHandler = (error, req, res, next) => {
    if (error.name === "ValidationError") {
        res.status(400).send({ "error": error.message })
        logger.info(error)
    }
    else if (error.name === "CastError") {
        res.status(400).send({ "error": "malformatted id" })
    }
    next(error)
}

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: "Unknown end point" })
}

module.exports = {
    errorHandler,
    unknownEndPoint
}