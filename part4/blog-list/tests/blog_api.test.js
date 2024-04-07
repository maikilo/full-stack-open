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

describe('Getting blogs from API', () => {
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


describe('Sending blogs to API', () => {

  test('Posting a blog is successful', async () => {
    const newBlog = {
      title: "Honey Don't",
      author: "Ringo",
      likes: 0,
      url: "https://google.com/"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.length, 4)
  })

  test('Posting a blog without likes sets default likes as 0', async () => {
    const newBlog = {
      title: "Honey Don't",
      author: "Ringo",
      url: "https://google.com/"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    const savedBlog = await Blog.findOne({author: "Ringo"})
    const likes = savedBlog.likes
    assert.strictEqual(likes, 0)
  })

  test('Posting a blog without title will not be saved due to bad request', async () => {
    const newBlog = {
      author: "Ringo",
      url: "https://google.com/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('Posting a blog without url will not be saved due to bad request', async () => {
    const newBlog = {
      title: "Honey Don't",
      author: "Ringo"
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

})

describe.only('Deleting blogs from API', () => {

  test.only('Deleting a blog is successful', async () => {
    const blog = await Blog.findOne({title: "Hey Jude"})
    const blogId = blog.toJSON().id
    await api.delete(`/api/blogs/${blogId}`).expect(204)
    const response = await api.get('/api/blogs/')
    const blogsAfter = response.body
    assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)
  })

})


describe.only('Updating blogs using API', () => {

  test.only('Updating a blog is successful', async () => {
    const blog = await Blog.findOne({title: "Strawberry Fields Forever"})
    const updatedBlog = {title: blog.title, author: blog.author, url: blog.url, likes: 100, id: blog._id.toString()}
    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
    const response = await api.get(`/api/blogs/${updatedBlog.id}`).expect(200)
    assert.strictEqual(response.body.likes, 100)
  })

})

