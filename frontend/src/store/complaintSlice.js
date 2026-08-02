import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/axios'

export const fetchComplaints = createAsyncThunk('complaints/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const isDepartment = state.auth.role && String(state.auth.role).toUpperCase() !== 'CITIZEN'
    const endpoint = isDepartment ? '/api/v1/complaints/assigned' : '/api/v1/complaints/citizen'
    const response = await API.get(endpoint)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch complaints')
  }
})

export const createComplaint = createAsyncThunk('complaints/create', async (complaintData, { rejectWithValue }) => {
  try {
    const response = await API.post('/api/v1/complaints', complaintData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to file complaint')
  }
})
export const assignComplaint = createAsyncThunk('complaints/assign', async ({ id, supervisorId }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/v1/complaints/${id}/assign?supervisorId=${supervisorId}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to assign complaint')
  }
})

export const updateComplaintStatus = createAsyncThunk('complaints/status', async ({ id, status, comment }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/v1/complaints/${id}/status`, { status, comment })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update status')
  }
})

export const escalateComplaint = createAsyncThunk('complaints/escalate', async (id, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/v1/complaints/${id}/escalate`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.response?.data || 'Failed to escalate complaint')
  }
})


const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
      .addCase(assignComplaint.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(escalateComplaint.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.list.splice(index, 1) // Remove from list because it's reassigned (unless citizen)
        }
      })
  },
})

export default complaintSlice.reducer
