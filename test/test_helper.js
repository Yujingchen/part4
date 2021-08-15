const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'awesome day!',
        author: 'kate',
        url: 'www.music.com',
        user: '61195050e54bcf5a0a8d90da'
    },
    {
        title: 'Tonight the music is good!',
        author: 'kate',
        url: 'www.tonight.com',
        user: '61195050e54bcf5a0a8d90da'
    },
]

const initialUserToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxMTk1MDUwZTU0YmNmNWEwYThkOTBkYSIsImlhdCI6MTYyOTA0ODk5NywiZXhwIjoxNjI5MDU4OTk3fQ.GPqIMdsz1Yhz-hKFDrUOgeCUbYXNOsLS7_ndcbWn_4E'

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
    initialUserToken,
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}