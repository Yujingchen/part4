const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require("express-async-errors")
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
}
)
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
blogRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(body.userId)
    console.log(user._id)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        likes: body.likes === undefined ? 0 : body.likes,
        url: body.url,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
})
blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.status(200).json(blog.toJSON())
    }
    else {
        response.status(404).end()
    }
})
blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})
blogRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes }, { new: true })
    response.status(204).json(updatedBlog)
})

module.exports = blogRouter