import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import complaintReducer from './complaintSlice'
import notificationReducer from './notificationSlice'
import analyticsReducer from './analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer,
  },
})
