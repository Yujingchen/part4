const express = require('express')
const personsRouter = express.Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
personsRouter.get('/:id', (request, response, next) => {
    let id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        }
        else {
            response.status(404).end()
        }
    }).catch(error => {
        console.log(error)
        next(error)
    })
})
personsRouter.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        let contactsLength = persons.length
        let currentTime = new Date()
        let info = `Phonebook has info for ${contactsLength} people \n ${currentTime}`
        response.send(info)
    })
})
personsRouter.post('/', (request, response, next) => {
    let body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'contact info missing'
        })
    }
    Person.find({}).then(persons => {
        if (persons.find(p => p.name === body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
        else {
            let person = new Person({
                name: body.name,
                number: body.number
            })
            person.save()
                .then(savedPerson => savedPerson.toJSON())
                .then(savedAndFormattedPerson => {
                    console.log(savedAndFormattedPerson)
                    response.json(savedAndFormattedPerson)
                }
                ).catch(error => next(error))
        }
    }).catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
        console.log(updatedPerson)
        response.json(updatedPerson)
    }).catch(error => next(error))
})
personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        console.log(result)
        response.status(204).end()
    }).catch(error => {
        next(error)
    })
})

module.exports = personsRouter