import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/axios'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post('/api/v1/auth/login', credentials)
    sessionStorage.setItem('token', response.data.accessToken)
    sessionStorage.setItem('refreshToken', response.data.refreshToken)
    sessionStorage.setItem('email', credentials.email)
    const userRole = response.data.role || 'CITIZEN'
    sessionStorage.setItem('role', userRole)
    sessionStorage.setItem('username', response.data.username)
    return { token: response.data.accessToken, email: credentials.email, role: userRole, username: response.data.username }
  } catch (error) {
    const msg = error.response?.data?.message;
    return rejectWithValue(typeof msg === 'object' ? Object.values(msg).join(', ') : (msg || 'Authentication failed'))
  }
})

export const registerUser = createAsyncThunk('auth/register', async (details, { rejectWithValue }) => {
  try {
    const response = await API.post('/api/v1/auth/register', details)
    return { message: response.data.message, email: details.email }
  } catch (error) {
    const msg = error.response?.data?.message;
    return rejectWithValue(typeof msg === 'object' ? Object.values(msg).join(', ') : (msg || 'Registration failed'))
  }
})

export const verifyAccount = createAsyncThunk('auth/verifyAccount', async (details, { rejectWithValue }) => {
  try {
    const response = await API.post('/api/v1/auth/verify-account', details)
    sessionStorage.setItem('token', response.data.accessToken)
    sessionStorage.setItem('refreshToken', response.data.refreshToken)
    sessionStorage.setItem('email', details.email)
    const userRole = response.data.role || 'CITIZEN'
    sessionStorage.setItem('role', userRole)
    sessionStorage.setItem('username', response.data.username)
    return { token: response.data.accessToken, email: details.email, role: userRole, username: response.data.username }
  } catch (error) {
    const msg = error.response?.data?.message;
    return rejectWithValue(typeof msg === 'object' ? Object.values(msg).join(', ') : (msg || 'OTP Verification failed'))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: sessionStorage.getItem('token') || null,
    email: sessionStorage.getItem('email') || null,
    role: sessionStorage.getItem('role') || null,
    username: sessionStorage.getItem('username') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.email = null
      state.role = null
      state.username = null
      sessionStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.email = action.payload.email
        state.role = action.payload.role
        state.username = action.payload.username
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.email = action.payload.email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.email = action.payload.email
        state.role = action.payload.role
        state.username = action.payload.username
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
