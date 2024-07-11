import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Hello World',
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