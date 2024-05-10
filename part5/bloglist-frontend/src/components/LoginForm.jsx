const LoginForm = ({
  username,
  password,
  handleLogin,
  handleUsernameChange,
  handlePasswordChange
}) => {
  return (
    <form onSubmit={handleLogin} className='loginForm' data-testid='loginForm'>
      <div>
        username
        <input
          value={username}
          name="Username"
          onChange={handleUsernameChange}
          data-testid='login-username'
        />
      </div>
      <div>
        password
        <input
          value={password}
          name="Password"
          onChange={handlePasswordChange}
          data-testid='login-password'
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm