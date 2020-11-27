const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    console.log(body)
    if (body.password.length < 3) {
        response.status(401).send({ "error": "password length must be at least 3" })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })
    response.json(users.map(u => u.toJSON()))
})

userRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = userRouter