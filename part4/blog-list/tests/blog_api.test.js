const { test, after, describe, beforeEach, } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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

const testUser = {
  name: 'Test User',
  username: 'testUser',
  password: 'password',
}

beforeEach(async () => {
  await User.deleteMany({})
  const saltRounds = 10
  testUser.passwordHash = await bcrypt.hash(testUser.password, saltRounds)
  const tester = new User(testUser)
  await tester.save()

  initialBlogs[0].user = tester
  initialBlogs[1].user = tester
  initialBlogs[2].user = tester

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()

  const savedBlogs = await Blog.find({}).populate('user')
  const jsonBlogs = savedBlogs.map(blog => blog.toJSON())
  
  const blogIds = jsonBlogs.map(blog => blog.id)
  tester.blogs = tester.blogs.concat(blogIds)
  await tester.save()

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
    const auth = await api.post('/api/login').send({username: testUser.username, password: testUser.password})
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: 'Bearer ' + auth.body.token})
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
    const auth = await api.post('/api/login').send({username: testUser.username, password: testUser.password})
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: 'Bearer ' + auth.body.token})
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
    const auth = await api.post('/api/login').send({username: testUser.username, password: testUser.password})
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: 'Bearer ' + auth.body.token})
      .expect(400)

    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('Posting a blog without url will not be saved due to bad request', async () => {
    const newBlog = {
      title: "Honey Don't",
      author: "Ringo"
    }
    const auth = await api.post('/api/login').send({username: testUser.username, password: testUser.password})
    await api
      .post('/api/blogs/')
      .send(newBlog)
      .set({Authorization: 'Bearer ' + auth.body.token})
      .expect(400)

    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

})

describe('Deleting blogs from API', () => {
  test('Deleting a blog is successful', async () => {
    const blog = await Blog.findOne({title: "Hey Jude"})
    const blogId = blog.toJSON().id
    const auth = await api.post('/api/login').send({username: testUser.username, password: testUser.password})
    await api
      .delete(`/api/blogs/${blogId}`)
      .set({Authorization: 'Bearer ' + auth.body.token})
      .expect(204)
    const response = await api.get('/api/blogs/')
    const blogsAfter = response.body
    assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)
  })
})


describe('Updating blogs using API', () => {
  test('Updating a blog is successful', async () => {
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

