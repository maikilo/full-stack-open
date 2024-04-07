const config = require('./utils/config')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const Blog = require('./models/blog')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

console.log('env is', config.ENV)

module.exports = app