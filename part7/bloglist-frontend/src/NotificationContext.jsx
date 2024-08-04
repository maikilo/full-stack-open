import { createContext, useReducer, useContext } from 'react'

export const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'CREATE':
    return action.payload
  case 'CLEAR':
    return ''
  default:
    return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationValueAndDispatch = useContext(NotificationContext)
  return notificationValueAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationValueAndDispatch = useContext(NotificationContext)
  return notificationValueAndDispatch[1]
}