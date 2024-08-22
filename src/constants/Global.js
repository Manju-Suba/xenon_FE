import axios from 'axios'
import { API_AUTH_URL } from './constants'

function logout_function() {
  window.localStorage.clear()
  localStorage.removeItem('token')
}

const axiosInstance = axios.create({
  baseURL: API_AUTH_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (error.response.data.message === 'Invalid Token') {
          logout_function()
        }
        console.log(error.response.data.message)
      }
    } else if (error.request) {
      console.log('No response received:', error.request)
    } else {
      console.log('Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
