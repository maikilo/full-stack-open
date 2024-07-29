import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'

const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  const setNotification = (payload) => {
    dispatch({ payload, type: 'CREATE' })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      setNotification( { message: 'Error in posting a blog', messageType: 'error' })
    }
  })
  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (blog) => {
      setNotification( { message: `An error occured when liking ${blog.title}`, messageType: 'error' })
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      setNotification( { message: 'Error in deleting a blog', messageType: 'error' })
    }
  })

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
      setNotification( { message: `Logged in user ${username} successfully`, messageType: 'notification' })
    } catch (exception) {
      setNotification( { message: 'Wrong credentials', messageType: 'error' })
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
    likeBlogMutation.mutate(updatedBlog)
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (confirm(`Sure you want to delete ${blog.title}?`)) {
      deleteBlogMutation.mutate(id)
    }
  }

  const postBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel={'login'} >
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
          <BlogForm postBlog={postBlog} />
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

  const { isPending, error, data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const blogs = data.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.messageType} />
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
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              deleteBlog={deleteBlog}
              loggedInUser={user.name}
            />
          )}
        </div>
      }
    </div>
  )


}

export default App