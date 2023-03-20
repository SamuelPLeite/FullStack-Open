const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('/api/blogs', () => {
  test('correct amount of notes are returned as json', async () => {
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogBody = response.body
    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogBody).toHaveProperty('title', 'Type wars')
    expect(blogBody).toHaveProperty('author', 'Robert C. Martin')
    expect(blogBody).toHaveProperty('url', 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
    expect(blogBody).toHaveProperty('likes', 2)

  })

  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body).toHaveProperty('likes', 0)
  })

  test('missing title property results in 400 bad request response', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    expect(response.body).toHaveProperty('error', 'Blog validation failed: title: Path `title` is required.')
  })

  test('missing url property results in 400 bad request response', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 2
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    expect(response.body).toHaveProperty('error', 'Blog validation failed: url: Path `url` is required.')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
