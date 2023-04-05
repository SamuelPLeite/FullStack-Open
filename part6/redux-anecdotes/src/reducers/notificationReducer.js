import { createSlice } from "@reduxjs/toolkit"

const initialState = ''
let timeoutID = undefined

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return ''
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const setNotification = (notification, timeout) => {
  return dispatch => {
    if (timeoutID)
      clearTimeout(timeoutID)

    dispatch(addNotification(notification))

    timeoutID = setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer