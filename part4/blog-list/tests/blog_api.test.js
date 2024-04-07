const { test, after, describe, beforeEach, } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Hey Jude',
    author: 'Paul',
    likes: 3,
    url: "https://google.com/"
  },
  {
    title: 'Strawberry Fields Forever',
    author: 'John',
    likes: 2,
    url: "https://google.com/"
  },
  {
    title: 'While My Guitar Gently Weeps',
    author: 'George',
    likes: 1,
    url: "https://google.com/"
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

after(async () => {
  await mongoose.connection.close()
})

describe('Blogs from API', () => {
  test('Blogs are returned as json', async () => {
    const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, 3)
  })

  test('Blog has field id and not _id', async () => {
    const response = await api.get('/api/blogs')

    //response.body.forEach(o => assert(Object.keys(o).includes('id')))
    const firstItem = response.body[0]
    assert(Object.keys(firstItem).includes('id'))
  })
})


describe('Blogs to API', () => {

  test('Posting a blog is successful', async () => {
    const newBlog = Blog({
      title: "Honey Don't",
      author: "Ringo",
      likes: 0,
      url: "https://google.com/"
    })
    console.log('newBlog', newBlog)
    await newBlog.save()
    const blogs = await helper.blogsInDb()
    console.log('blogs', blogs)
    assert.strictEqual(blogs.length, 4)
  })

  test('Posting a blog without likes sets default likes as 0', async () => {
    const newBlog = Blog({
      title: "Honey Don't",
      author: "Ringo",
      url: "https://google.com/"
    })
    await newBlog.save()
    const savedBlog = await Blog.findOne({author: "Ringo"})
    const likes = savedBlog.likes
    assert.strictEqual(likes, 0)
  })

  test('Posting a blog without title will not be saved due to bad request', async () => {
    const newBlog = Blog({
      author: "Ringo",
      url: "https://google.com/"
    })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('Posting a blog without url will not be saved due to bad request', async () => {
    const newBlog = Blog({
      title: "Honey Don't",
      author: "Ringo"
    })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

})

