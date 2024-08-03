import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'

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

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      setNotification( { message: 'Error in posting a blog', messageType: 'error' })
    }
  })

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
          <div key={blog.id} className='blog'>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        )}
      </div>
    </div>
  )
}

const Menu = ({ user, logout }) => {
  const padding = {
    paddingRight: 10
  }
  return (
    <div>
      <Link style={padding} to="/">Blogs</Link>
      <Link style={padding} to="/users">Users</Link> <span>{user.name} logged in</span>
      <button onClick={logout}>logout</button>
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
      {user && <Menu user={user} logout={logout}/>}
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.messageType} />
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