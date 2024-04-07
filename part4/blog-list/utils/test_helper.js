const Blog = require('../models/blog')

const dummy = (blogs) => {
    return(1)
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    const likes = blogs.map(({likes}) => (likes))
    return likes.reduce(reducer, 0)
}
  
const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce(
        (prev, current) => {
          return prev.likes > current.likes ? prev : current
        }
      )
    return blogWithMostLikes
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    blogsInDb
}