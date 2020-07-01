const Blog = require('../models/blog')


const initialBlogs = [
    {
        title: 'awesome day!',
        author: "kate",
        url: "www.music.com"
    },
    {
        title: 'Tonight the music is good!',
        author: "kate",
        url: "www.tonight.com"
    },
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: "good news or bad news?",
        url: "www.future.com"
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

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}