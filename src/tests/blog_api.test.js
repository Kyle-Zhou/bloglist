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

afterAll(async () => {
  await mongoose.connection.close()
})