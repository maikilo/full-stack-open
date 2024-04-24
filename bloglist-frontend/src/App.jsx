import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log('blogs', blogs)
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Logged in user ${username} successfully`)
      setTimeout(() => {
          setNotification(null)
      }, 4000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.clear()
  }

  const addLike = id => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: user.id }
    blogService
      .update(blog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs
          .map(blog => blog.id !== id ? blog : { ...returnedBlog, user: blog.user})
          .sort((a, b) => b.likes - a.likes))
      })
      .catch(error => {
        setErrorMessage(
          `An error occured when liking ${blog.title}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const postBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {"title": title, "author": author, "url": url}
      const blogPost = await blogService.create(newBlog)
      console.log('posted blog', blogPost)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage('Error in posting a blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const loginForm = () => {
    return (
      <div>
        <Togglable showButtonLabel={'login'} hidebuttonLabel={'cancel'}>
          <LoginForm 
            username={username}
            password={password}
            handleLogin={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        </Togglable>
      </div>
    )
}

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
    
    return (
      <div>
        <div style={showWhenVisible}>
          <BlogForm 
            title={title}
            author={author}
            url={url}
            postBlog={postBlog}
            handleTitleChange={({ target }) => setTitle(target.value)}
            handleAuthorChange={({ target }) => setAuthor(target.value)}
            handleUrlChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} type={'notification'} />
      <Notification message={error} type={'error'} />
      {!user && loginForm()}
      {user && 
        <div>
          <p>{user.name} logged in</p> 
          <button onClick={handleLogout}>logout</button>
        </div>
      }
      {user && blogForm()}
      {user && 
        <div>
          <h3>Old blog posts</h3>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} addLike={addLike} />
          )}
        </div>
      }
    </div>
  )


}

export default App