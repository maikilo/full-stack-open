import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, Navigate, useMatch, useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationValue, useNotificationDispatch } from './NotificationContext'
import { useUserValue, useUserDispatch } from './UserContext'


const Blogs = ({ setNotification }) => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const queryClient = useQueryClient()
  const user = useUserValue()

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
      {blogForm()}
      <div>
        <h3>Old blog posts</h3>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            loggedInUser={'user.name'}
          />
        )}
      </div>
    </div>
  )
}

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">Blogs</Link>
      <Link style={padding} to="/users">Users</Link>
    </div>
  )
}


const App = () => {
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()

  const user = useUserValue()
  const userDispatch = useUserDispatch()

  const navigate = useNavigate()

  const setNotification = (payload) => {
    notificationDispatch({ payload, type: 'CREATE' })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    try {
      const newUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(newUser))
      blogService.setToken(newUser.token)
      userDispatch({ payload: newUser, type: 'LOGIN' })
      navigate('/', { replace: true })
      setNotification( { message: `Logged in user ${newUser.username} successfully`, messageType: 'notification' })
    } catch (exception) {
      setNotification( { message: 'Wrong credentials', messageType: 'error' })
    }
  }

  const logout = (event) => {
    event.preventDefault()
    userDispatch({ type: 'LOGOUT' })
    window.localStorage.clear()
  }

  return (
    <div>
      {user && <Menu />}
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.messageType} />
      {user &&
        <div>
          <p>{user.name} logged in</p>
          <button onClick={logout}>logout</button>
        </div>
      }
      <Routes>
        <Route path="/" element={user ? <Blogs setNotification={setNotification} /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={user ? <Navigate replace to="/" /> : <LoginForm onLogin={login}/> } />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/users/:username" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </div>
  )
}

export default App