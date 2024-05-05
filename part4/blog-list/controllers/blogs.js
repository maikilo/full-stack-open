const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    const jsonBlogs = blogs.map(blog => blog.toJSON())
    response.status(200).json(jsonBlogs)
  } catch(error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user')
    response.status(200).json(blog.toJSON())
  } catch(error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log('decodedToken', decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user
    const body = request.body
    body.user = user

    const blog = new Blog(body)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)

  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user

    const blogToDelete = await Blog.findById(request.params.id)
    blogToDelete === null && response.status(404).json({ error: 'Did not find a blog by that id to delete'})
    blogToDelete.user.toString() === user._id.toString() ? await Blog.findByIdAndDelete(request.params.id) : response.status(401).json({ error: 'This user is not authorized to delete the blog' })
    response.status(204).end()

  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog.toJSON())
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter