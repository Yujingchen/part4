const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')){
//         return authorization.substring(7)
//     }
//     return null
// }

require('express-async-errors')
blogRouter.get('/', async (request, response) => {
    console.log('get blogs')
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
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
    console.log('get blog by id')
    const blog = await Blog.findById(request.params.id).catch(error => next(error))
    if (blog) {
        response.status(200).json(blog.toJSON())
    }
    else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    console.log('add blog')
    const body = request.body
    const token = request.token
    const user = request.user
    if (!token || !user.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const userInDb = await User.findById(user.id)
    // const user = await User.findById(body.userId)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        likes: body.likes === undefined ? 0 : body.likes,
        url: body.url,
        user: userInDb.id
    })
    const savedBlog = await blog.save()
    userInDb.blogs = userInDb.blogs.concat(savedBlog._id)
    await userInDb.save()
    response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
    console.log('delete blog by id')
    const token = request.token
    const user = request.user

    if (!token || !user.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToDelete = await Blog.findById({_id: request.params.id})
    if (blogToDelete.user.toString() !== user.id.toString())    {
        return response.status(401).json({error: 'token is missing or incorrect user'})
    }
    const deletedBlog = await Blog.findOneAndDelete({ _id: request.params.id })
    response.status(204).json(deletedBlog)
})

blogRouter.put('/:id', async (request, response, next) => {
    console.info('update blogs')
    const body = request.body
    const token = request.token
    const user = request.user
    if (!token || !user.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true }).catch(error => next(error))
    response.status(201).json(updatedBlog.toJSON())
})


blogRouter.post('/reset', async (request, response) => {
    const token = request.token
    const user = request.user
    console.info('reset users and blogs')
    if (!token || !user.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})

module.exports = blogRouter