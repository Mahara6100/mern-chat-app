// src/api.js

import axios from 'axios'

// ✅ Create Axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Use env in production
})

// ✅ Add Authorization token if user is logged in
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('userInfo')
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  }
  return req
})

// ✅ API calls
export const register = (userData) => API.post('/user/register', userData)
export const login = (userData) => API.post('/user/login', userData)
export const getProfile = () => API.get('/user/profile')

export default API
