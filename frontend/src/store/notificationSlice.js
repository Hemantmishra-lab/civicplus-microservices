import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/axios'

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/api/v1/notifications')
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch notifications')
  }
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer
