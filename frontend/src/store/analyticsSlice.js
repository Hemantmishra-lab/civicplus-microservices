import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/axios'

export const fetchAnalytics = createAsyncThunk('analytics/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/api/v1/analytics/dashboard')
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch analytics')
  }
})

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default analyticsSlice.reducer
