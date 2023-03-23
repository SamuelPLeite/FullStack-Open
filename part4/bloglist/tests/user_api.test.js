const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('adding users to db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('paxxword', 10)
    const user = new User({ username: 'TANK', passwordHash })

    await user.save()
  })

  test('works if user is valid', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      username: 'fearless',
      name: 'Fear Less',
      password: 'blu3fl4me'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersEnd = await helper.usersInDb()
    expect(usersEnd).toHaveLength(usersStart.length + 1)

    const usersUsernames = usersEnd.map(user => user.username)
    expect(usersUsernames).toContain(newUser.username)
  })

  test('fails when user has no username', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      name: 'No Username',
      password: 'blu3fl4me'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('error', 'User validation failed: username: Path `username` is required.')
    const usersEnd = await helper.usersInDb()
    expect(usersEnd).toHaveLength(usersStart.length)

    const usersNames = usersEnd.map(user => user.name)
    expect(usersNames).not.toContain(newUser.name)
  })

  test('fails when user has too short a password', async () => {
    const usersStart = await helper.usersInDb()

    const newUser = {
      username: 'shortpaxxword',
      name: 'Fear Less',
      password: 'pa'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('error', 'Password is required, should be atleast 3 characters long.')
    const usersEnd = await helper.usersInDb()
    expect(usersEnd).toHaveLength(usersStart.length)

    const usersUsernames = usersEnd.map(user => user.username)
    expect(usersUsernames).not.toContain(newUser.username)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})