import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import PasskeyInput from './components/PasskeyInput'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'

import useAxios from './hooks/useAxios'

const App = () => {
  // const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { instance, setAuthToken, token } = useAxios()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  // const navigate = useNavigate()

  const isLoggedIn = async () => {
    try {
      const response = await instance.post('/auth/is_verified')
      console.log(response)
      response.data ? setIsAuthenticated(true) : setIsAuthenticated(false)
    } catch (error) {
      setErrorMessage(error.response?.data?.message)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

  // console.log(isEditing)

  return (
    <Fragment>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/register'
            element={
              <Register
                instance={instance}
                setAuthToken={setAuthToken}
                token={token}
              />
            }
          />
         <Route path='/login' element={<Login instance={instance} setAuthToken={setAuthToken} token={token}/>} />
         <Route path='/login/passkey' element={<PasskeyInput />}/>
        </Routes>
      </div>
    </Fragment>
  )
}

export default App
