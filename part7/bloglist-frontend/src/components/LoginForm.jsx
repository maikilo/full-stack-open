import { useState } from 'react'
import Togglable from './Togglable'


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    onLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Togglable buttonLabel={'login'} >
      <form onSubmit={handleLogin} className='loginForm' data-testid='loginForm'>
        <div>
          username
          <input
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid='login-username'
          />
        </div>
        <div>
          password
          <input
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid='login-password'
          />
        </div>
        <button type="submit">login</button>
      </form>
    </Togglable>
  )
}

export default LoginForm