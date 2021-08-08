const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'awesome day!',
        author: 'kate',
        url: 'www.music.com'
    },
    {
        title: 'Tonight the music is good!',
        author: 'kate',
        url: 'www.tonight.com'
    },
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'good news or bad news?',
        url: 'www.future.com'
    })
    const id = blog._id.toString()
    await blog.save()
    await Blog.findByIdAndDelete(id)
    return id
}

const blogsInDb = async () => {
    const retrivedBlogs = await Blog.find({})
    return retrivedBlogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}