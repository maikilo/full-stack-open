const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({}) //.populate('blogs')
  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id) //.populate('blogs')
    response.status(200).json(user.toJSON())
  } catch(exception) {
    next(exception)
  }  
})

usersRouter.post('/', async (request, response, next) => {

  try {
    const { username, name, password } = request.body
    if (password.length < 3) {
      throw new Error('Invalid password')
      /* return response.status(400).json({ error: 'Password must be at least three characters long.' }) */
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
    response.status(201).json(savedUser)
    
  } catch(error) {
    next(error)
  }
  
})

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
})


module.exports = usersRouter