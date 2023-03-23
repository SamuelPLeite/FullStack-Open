const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = helper.initialUsers[0]
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = new User({ ...user, passwordHash })
  await newUser.save()
})

describe('receiving one or many blogs', () => { // outdated tests
  test('correct amount of blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)

  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test('viewing a specific blog', async () => {
    const initialBlogsDb = await helper.blogsInDb()
    const blogSpecific = initialBlogsDb[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogSpecific.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogSpecific)
  })
})

describe('adding new blogs to database', () => {
  test('post request successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }
    const userLogin = {
      username: 'root',
      password: 'PAXXWORD'
    }

    const loginData = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)


    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loginData.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogBody = response.body
    const blogsAfter = await helper.blogsInDb()
    const userAfter = (await User.findOne({ username: userLogin.username })).toJSON()

    expect(blogBody.user).toBe(userAfter.id)
    expect(blogBody).toHaveProperty('user',)
    expect(blogBody).toHaveProperty('title', 'Type wars')
    expect(blogBody).toHaveProperty('author', 'Robert C. Martin')
    expect(blogBody).toHaveProperty('url', 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
    expect(blogBody).toHaveProperty('likes', 2)
    expect(blogsAfter).toHaveLength(1)

  })

  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const userLogin = {
      username: 'root',
      password: 'PAXXWORD'
    }

    const loginData = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loginData.body.token}`)
      .expect(201)

    expect(response.body).toHaveProperty('likes', 0)
  })

  test('missing title property results in 400 bad request response', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    const userLogin = {
      username: 'root',
      password: 'PAXXWORD'
    }

    const loginData = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loginData.body.token}`)
      .expect(400)

    expect(response.body).toHaveProperty('error', 'Blog validation failed: title: Path `title` is required.')
  })

  test('missing url property results in 400 bad request response', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 2
    }

    const userLogin = {
      username: 'root',
      password: 'PAXXWORD'
    }

    const loginData = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loginData.body.token}`)
      .expect(400)

    expect(response.body).toHaveProperty('error', 'Blog validation failed: url: Path `url` is required.')
  })

  test('post request successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)


    expect(response.body).toHaveProperty('error', 'jwt must be provided')
  })
})

describe('deleting blogs from database', () => { // outdated tests
  test('deleting a blog successfully', async () => {
    const initialBlogsDb = await helper.blogsInDb()
    const blogToDelete = initialBlogsDb[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsPostDeletion = await helper.blogsInDb()
    const blogIds = blogsPostDeletion.map(blog => blog.id)

    expect(blogsPostDeletion).toHaveLength(initialBlogsDb.length - 1)
    expect(blogIds).not.toContain(blogToDelete.id)
  })

  test('deleting a blog with invalid id', async () => {
    const invalidId = '6a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('updating blogs in database', () => { // outdated tests
  test('updating blog successfully', async () => {
    const initialBlogsDb = await helper.blogsInDb()
    const blogToUpdate = initialBlogsDb[0]
    const blogUpdate = {
      title: 'New Title',
      author: 'New Author',
      url: 'New Url',
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdate)
      .expect(200)

    const updatedBlog = response.body
    expect(updatedBlog).toHaveProperty('title', 'New Title')
    expect(updatedBlog).toHaveProperty('likes', blogToUpdate.likes + 10)

    const updatedBlogDb = await Blog.findById(blogToUpdate.id)
    expect(updatedBlogDb).toHaveProperty('title', 'New Title')
    expect(updatedBlogDb).toHaveProperty('likes', blogToUpdate.likes + 10)

  })

  test('updating a blog with invalid id', async () => {
    const invalidId = '6a3d5da59070081a82a3445'

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})