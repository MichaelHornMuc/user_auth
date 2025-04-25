import React, { Fragment, useCallback, useEffect, useState } from 'react'

import usePasswordToggle from '../utils/togglePassword'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link } from 'react-router-dom'



const Login = ({
  instance,
  setAuthToken,
  successMessage,
  setSuccessMessage,
  setIsAuthenticated,
  setErrorMessage,
  errorMessage,
  isRedirected,
  setIsRedirected
}) => {
  const [loginData, setLoginData] = useState({})
  // const [isRedirected, setIsRedirected] = useState(false)
  const { showPassword, togglePasswordVisibility } = usePasswordToggle()
  
  const navigate = useNavigate()

  const openEye = <FontAwesomeIcon icon={faEye} />
  const closedEye = <FontAwesomeIcon icon={faEyeSlash} />

  const isLoggedIn = useCallback(async () => {
    try {
      const response = await instance.post('/auth/is_verified')
      if(response.data.user || response.data.users) {
        setIsAuthenticated(true)
        setSuccessMessage(response.data.message)
        // setErrorMessage(error.response.data.message)
      } 
    } catch (error) {
      // console.log(error)
      setErrorMessage(error.response.data.message)
    }
  }, [instance, setIsAuthenticated, setErrorMessage, setSuccessMessage]
)
  useEffect(() => {

    isLoggedIn()
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await instance.post('/auth/login', loginData)
      setIsRedirected(response.data.verifiedOTP.success)
      if (response.data) {
        setAuthToken(response.data.accessToken)
        setSuccessMessage(response.data.message)
        setIsAuthenticated(true)
        setTimeout(() => {
          navigate('/dashboard')
          setIsAuthenticated(true)
        }, 3000)
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response?.data?.message)
    }
  }

console.log(isRedirected)

  const password = document.getElementById('user_password')

  return (
    <div>
      
        <Fragment>
          <h2 className='text-center'>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor='user_email' className='form-label'>
              Enter your email address
            </label>
            <input
              autoFocus
              type='email'
              name='user_email'
              id='user_email'
              className='form-control'
              value={loginData.user_email || ''}
              onChange={handleChange}
            />
            <label htmlFor='user_password' className='form-label'>
              Enter your password
            </label>
            <input
              type='password'
              name='user_password'
              id='user_password'
              className='form-control my-3'
              value={loginData.user_password || ''}
              onChange={handleChange}
            />
            <button
              onClick={() => togglePasswordVisibility(password)}
              type='button'
              className='btn my-3 btn-info btn-sm'>
              <i id='openEye' name='openEye'>
                {showPassword ? closedEye : openEye}
              </i>
              <label htmlFor='openEye' className='form-label m-2'>
                {showPassword ? 'Hide Password' : 'Show Password'}
              </label>
            </button>
            <br />
            <button
              type='submit'
              className='btn btn-primary my-3'
              onClick={handleSubmit}>
              Login to your account
            </button>
          </form>
          <Link to='/register'>Register an account</Link>
          {successMessage ? (
            <Fragment>{successMessage}</Fragment>
          ) : (
            <Fragment>{errorMessage}</Fragment>
          )}
        </Fragment>
      
    </div>

    //   <Fragment>
    //     <h2 className='text-center'>Login</h2>
    //     <form onSubmit={handleSubmit}>
    //       <label htmlFor='user_email' className='form-label'>
    //         Enter your email address
    //       </label>
    //       <input
    //         autoFocus
    //         type='email'
    //         name='user_email'
    //         id='user_email'
    //         className='form-control'
    //         value={loginData.user_email || ''}
    //         onChange={handleChange}
    //       />
    //       <label htmlFor='user_password' className='form-label'>
    //         Enter your password
    //       </label>
    //       <input
    //         type='password'
    //         name='user_password'
    //         id='user_password'
    //         className='form-control my-3'
    //         value={loginData.user_password || ''}
    //         onChange={handleChange}
    //       />
    //       <button
    //         onClick={() => togglePasswordVisibility(password)}
    //         type='button'
    //         className='btn my-3 btn-info btn-sm'>
    //         <i id='openEye' name='openEye'>
    //           {showPassword ? closedEye : openEye}
    //         </i>
    //         <label htmlFor='openEye' className='form-label m-2'>
    //           {showPassword ? 'Hide Password' : 'Show Password'}
    //         </label>
    //       </button>
    //       <br />
    //      </form>

    //     <Link to='/register'>Register an account</Link>
    //     {successMessage ? (
    //       <Fragment>{successMessage}</Fragment>
    //     ) : (
    //       <Fragment>{errorMessage}</Fragment>
    //     )}

    //   </Fragment>
  )
}

export default Login
