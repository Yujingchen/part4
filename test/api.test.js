const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.remove({})
    console.log('clear blog')
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    console.log('save')
})

describe('When db has some blogs saved', () => {
    test('get all blogs should return all blogs in json format', async () => {
        console.log('entered test')
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body)
            .toHaveLength(helper.initialBlogs.length)
    })
    test('blog object has id attribute', async () => {
        const response = await api.get('/api/blogs')
        response.body.map(b => {
            expect(b.id).toBeDefined()
        })
    })
    test('the first blog is about awesomeday', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        expect(titles).toContain('awesome day!')
    })
})


describe('when send post request', ()=> {
    test('fail to add blog if token is missing', async () => {
        const user = await User.find({ username: 'root' })
        const newBlog = {
            title: 'street bar is open',
            author: 'olivi',
            url: 'www.streetbar.com',
            id: user.id
        }
        await api.post('/api/blogs')
            .set({
                'Content-Type': 'application/json',
            })
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fail to add blog if token is wrong', async () => {
        const user = await User.find({ username: 'root' })
        const token = 'invalidtoken'
        const newBlog = {
            title: 'street bar is open',
            author: 'olivi',
            url: 'www.streetbar.com',
            id: user.id
        }
        await api.post('/api/blogs')
            .set({
                'Content-Type': 'application/json',
                'Authorization': token
            })
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})


describe('when send post requests to /api/blogs enpoint', () => {
    test('a validated blog can be added', async () => {
        const token = helper.initialUserToken
        const users = await User.find({ username: 'root' })
        users.map(u => u.toJSON())
        const newBlog = {
            title: 'street bar is open',
            author: 'olivi',
            url: 'www.streetbar.com',
            likes: 0,
        }
        await api.post('/api/blogs')
            .set({
                'Content-Type': 'application/json',
                'Authorization': token
            })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const content = blogsAtEnd.map(r => r.title)
        expect(content).toContain('street bar is open')
    })

    test('new blog has a like attribute equal to 0', async () => {
        const token = helper.initialUserToken
        const newBlog = {
            title: 'no likes blog',
            author: 'dummy',
            url: 'www.twitter.com',
        }
        const response = await api.post('/api/blogs')
            .set('Authorization', token)
            .send(newBlog)
            .expect(201)
        expect(response.body.likes).toBeDefined()
        expect(response.body.likes).toBe(0)
    })

    test('new blog title and url is required', async () => {
        const token = helper.initialUserToken
        const newBlog = {
            author: 'dummy',
        }
        await api.post('/api/blogs')
            .set('Authorization', token)
            .send(newBlog)
            .expect(400)
    })

    test('empty blog can not be added', async () => {
        const token = helper.initialUserToken
        const empty = {}
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(empty)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

// describe("when send put request to end point", () => {
//     test("update likes should return 204", async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogsToview = blogsAtStart[0]
//         const LikeUpdated = 2
//         await api.put(`/api/blogs/${blogsToview.id}`).send({ likes: LikeUpdated }).expect(204)
//         const response = await api.get(`/api/blogs/${blogsToview.id}`).expect(200)
//         expect(response.body.likes).toBe(LikeUpdated)
//     })
// })

describe('when send delete requests', () => {
    test('an existing blog can be deleted from db, status code 204', async () => {
        const token = helper.initialUserToken
        let blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[1]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', token)
            .expect(204)
        let blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
        const title = blogsAtEnd.map(r => r.title)
        expect(title).not.toContain(blogToDelete.title)
    })
})

// describe("viewing a blog", () => {
//     test("a blog can be view", async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogsToview = blogsAtStart[0]
//         const response = await api
//             .get(`/api/blogs/${blogsToview.id}`)
//             .expect(200)
//             .expect('Content-Type', /application\/json/)
//         expect(response.body).toEqual(blogsToview)
//     })

//     test('response with 404 if blog does not exist', async () => {
//         const validNoneExistingId = await helper.nonExistingId()
//         console.log(validNoneExistingId)
//         const response = await api.get(`/api/blogs/${validNoneExistingId}`)
//             .expect(404)
//         console.log(response.body)
//     })

//     test('respons with 400 if id is not valid', async () => {
//         await api.get(`/api/blogs/invalidaId`).expect(400)
//     })
// })


describe('test root user in db', () => {
    beforeEach(async () => {
        // await User.findOneAndRemove({ username: 'root' })
        await User.findOneAndRemove({ username: 'root2' })
        // await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root2', name:'root2', passwordHash })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'robot',
            name: 'robot',
            password: 'robot',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('new user with same username can not be created', async () => {
        const userAtStar = await helper.usersInDb()
        const newUser = { name: 'creativity', username: 'root2', password: 'okol' }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`username` to be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(userAtStar.length)
    })

    test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'root',
            password: 'root',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username length must be at least 3')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'root',
            password: 'ro',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password length must be at least 3')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
})

