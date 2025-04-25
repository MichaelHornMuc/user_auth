import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'

import useAxios from './hooks/useAxios'

const App = () => {
  // const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { instance, setAuthToken, token } = useAxios()
  const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
  // const navigate = useNavigate()

  

 

  const isLoggedIn = async () => {
    try {
      const response = await instance.post('/auth/is_verified')
      
      response.data ? setIsAuthenticated(true) : setIsAuthenticated(false)
    } catch (error) {
      setErrorMessage(error.response?.data?.message)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

 
 
  return (
    <Fragment>
      {/* <Router> */}
      <div className='container'>
        <Routes>
          <Route
            exact
            path='/login'
            element={
              !isAuthenticated ? (
                <Login
                  setAuthToken={setAuthToken}
                  setIsAuthenticated={setIsAuthenticated}
                  instance={instance}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                  token={token}
                />
              ) : (
                <Dashboard
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                  instance={instance}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                  setAuthToken={setAuthToken}
                  
                />
              )
            }
          />
          <Route
            exact
            path='/register'
            element={
              !isAuthenticated ? (
                <Register
                  setIsAuthenticated={setIsAuthenticated}
                  instance={instance}
                  setAuthToken={setAuthToken}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                />
              ) : (
                <Login
                  // setIsAuthenticated={setIsAuthenticated}
                  // instance={instance}
                  // setAuthToken={setAuthToken}
                  // setSuccessMessage={setSuccessMessage}
                  // setErrorMessage={setErrorMessage}
                  // successMessage={successMessage}
                  // errorMessage={errorMessage}
                />
              )
            }
          />
          <Route
            exact
            path='/dashboard'
            element={
              isAuthenticated ? (
                <Dashboard
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                  instance={instance}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                  successMessage={successMessage}
                  errorMessage={errorMessage}
                  setAuthToken={setAuthToken}
                  
                />
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </div>
      {/* </Router> */}
    </Fragment>
  )
}

export default App
