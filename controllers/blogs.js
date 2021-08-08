const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


require('express-async-errors')
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})
// blogRouter.post('/', async (request, response, next) => {
//     const blog = request.body
//     const newBlog = new Blog({
//         title: blog.title,
//         author: blog.author,
//     })
//     try {
//         const savedBlog = await newBlog.save()
//         response.status(201).json(savedBlog.toJSON())
//     }
//     catch (exception) {
//         next(exception)
//     }
// })

blogRouter.get('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id).catch(error => next(error))
    if (blog) {
        response.status(200).json(blog.toJSON())
    }
    else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    // const user = await User.findById(decodedToken.id).catch(error => next(error))
    const user = await User.findById(body.userId).catch(error => next(error))
    const blog = new Blog({
        title: body.title,
        author: body.author,
        likes: body.likes === undefined ? 0 : body.likes,
        url: body.url,
        user: user._id
    })

    const savedBlog = await blog.save().catch(error => next(error))
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const deletedBlog = await Blog.findOneAndDelete({ _id: request.params.id }).catch(error => next(error))
    response.status(204).json(deletedBlog)
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true }).catch(error => next(error))
    response.status(201).json(updatedBlog.toJSON())
})


blogRouter.post('/reset', async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = blogRouter