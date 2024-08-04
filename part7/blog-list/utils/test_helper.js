const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
  
const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), author => authorCounts[author])
    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

function mostLikes(blogs) {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const authorLikes = _.mapValues(groupedByAuthor, authorBlogs => _.sumBy(authorBlogs, 'likes'))
    const topAuthor = _.maxBy(_.keys(authorLikes), author => authorLikes[author])

    return {
        author: topAuthor,
        likes: authorLikes[topAuthor]
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    blogsInDb,
    usersInDb,
    mostBlogs,
    mostLikes
}