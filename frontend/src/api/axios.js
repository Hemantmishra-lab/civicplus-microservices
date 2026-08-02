import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080', // Gateway port
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token to requests
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default API
