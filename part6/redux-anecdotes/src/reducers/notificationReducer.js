import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Hello World'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const notification = action.payload
      return notification
    },
    deleteNotification(state, action) {
      return ''
    }
  },
})

export const { setNotification, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer