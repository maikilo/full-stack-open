const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Hey Jude',
    author: 'Paul',
    likes: 3,
  },
  {
    title: 'Strawberry Fields Forever',
    author: 'John',
    likes: 2,
  },
  {
    title: 'While My Guitar Gently Weeps',
    author: 'George',
    likes: 1,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})


describe('Blogs from API', () => {
  test('Blogs are returned as json', async () => {
    const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, 3)
  })

  test.only('Blog has field id and not _id', async () => {
    const response = await api
          .get('/api/blogs')
    
    //response.body.forEach(o => assert(Object.keys(o).includes('id')))
    const firstItem = response.body[0]
    assert(Object.keys(firstItem).includes('id'))
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
