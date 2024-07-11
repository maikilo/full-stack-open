import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Hello World',
  reducers: {
    updateNotification(state, action) {
      const notification = action.payload
      return notification
    },
    clearNotification(state, action) {
      return ''
    }
  },
})

export const { updateNotification, clearNotification } = notificationSlice.actions

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    dispatch(updateNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout)
  }
}

export default notificationSlice.reducer