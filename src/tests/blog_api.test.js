const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('ensure id is not _id', async () => {
  const response = await api.get('/api/blogs')
  expect(response._body[0].id).toBeDefined();
  expect(response._body[0]._id).toBe(undefined);

})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('ensure post request to add blogs works', async () => {
  const newBlog = 
  {
    title: 'new blog',
    author: 'new author',
    url: 'url',
    likes: 3
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

  const authors = blogsAtEnd.map(n => n.author)
  const titles = blogsAtEnd.map(n => n.title)

  expect(authors).toContain('new author')
  expect(titles).toContain('new blog')

})

test('deleting a blog', async () => {
  const blogsToStart = await helper.blogsInDb()
  const blogToDelete = blogsToStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogsAtEnd.title)
})

test('deleting a blog', async () => {
  const blogsBefore = await helper.blogsInDb()
  const blogToUseBefore = blogsBefore[0]
  updatedBlog = {
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUseBefore.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAfter = await helper.blogsInDb()
  const blogToUseAfter = blogsAfter[0]
  
  expect(blogToUseAfter.likes).toBe(10)
  expect(blogToUseAfter.author).toBe(blogToUseBefore.author)

})

// ----

const bcrypt = require('bcrypt')
const User = require('../models/user')


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
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
})

describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})