import { createContext, useReducer, useContext } from 'react'

export const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const UserContextProvider = (props) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  const parsedUser = JSON.parse(loggedUserJSON)
  const initUser = parsedUser ? parsedUser : null

  const [user, userDispatch] = useReducer(userReducer, initUser)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userValueAndDispatch = useContext(UserContext)
  return userValueAndDispatch[0]
}

export const useUserDispatch = () => {
  const userValueAndDispatch = useContext(UserContext)
  return userValueAndDispatch[1]
}