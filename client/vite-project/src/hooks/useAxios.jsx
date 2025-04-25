import axios from 'axios'
import { useState} from 'react'

const useAxios = () => {
  const [token, setToken] = useState(null)
  const instance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', 
      // 'Content-Type': 'multipart/form-data', 
    },
    withCredentials: true,
  })

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  const setAuthToken = (newToken) => {
    setToken(newToken)
  }

  return { instance, setAuthToken, token}
}
export default useAxios