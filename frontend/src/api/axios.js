import axios from 'axios'

const API = axios.create({
  baseURL: 'http://13.210.175.10:8080',
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