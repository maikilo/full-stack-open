const {MONGODB_URI, PORT} = require('../utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3
  },
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
