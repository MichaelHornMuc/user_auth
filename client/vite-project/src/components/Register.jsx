import React, { Fragment, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import usePasswordToggle from '../utils/togglePassword'
import { useNavigate, Link } from 'react-router-dom'



const Register = ({
  instance,
  setAuthToken,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
}) => {
  const [inputs, setInputs] = useState({})
  // const [successMessage, setSuccessMessage] = useState('')
  // const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { showPassword, togglePasswordVisibility } = usePasswordToggle()

  const openEye = <FontAwesomeIcon icon={faEye} />
  const closedEye = <FontAwesomeIcon icon={faEyeSlash} />

  const handleChange = (e) => {
    // console.log(e.target.value)
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  // app.use(express.static('../public'))

 

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await instance.post('/auth/register', inputs)
  
      if(response.status === 200) {
        setInputs(response)
      }
      setErrorMessage('')
      setSuccessMessage(response.data.message)
      setAuthToken(response.data.accessToken)
      setInputs({})
      setTimeout(() => {
        setSuccessMessage('')
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.message)
      // setInputs({})
    }
  }

    const password = document.getElementById('user_password')


  return (
    <Fragment>
      <h2 className='text-center'>Register</h2>
      <form onSubmit={handleSubmit} className='form-group'>
        <label htmlFor='user_name'>Enter your name</label>
        <input
          type='text'
          name='user_name'
          value={inputs.user_name || ''}
          onChange={handleChange}
          className='form-control my-3'
        />

        <label>
          Do you have security clearance? Assign Administrator Privileges.
        </label>
        <div className='form-check'>
          <label className='form-check-label' htmlFor='defaultCheck1'>
            Yes
          </label>
          <input
            id='defaultCheck1'
            type='radio'
            name='is_admin'
            value={true}
            onChange={handleChange}
            className='form-check-input '
          />
        </div>
        <div className='form-check'>
          <label className='form-check-label' htmlFor='defaultCheck2'>
            No
          </label>
          <input
            id='defaultCheck2'
            type='radio'
            name='is_admin'
            value={false}
            onChange={handleChange}
            className='form-check-input'
            // checked
          />
        </div>
        <label htmlFor='user_email'>Enter your email</label>
        <input
          type='email'
          name='user_email'
          value={inputs.user_email || ''}
          onChange={handleChange}
          className='form-control my-3'
        />
        <label htmlFor='user_password'>Enter your password*</label>
        <br />

        <input
          type='password'
          id='user_password'
          name='user_password'
          // value={inputs.user_password || ''}
          onChange={handleChange}
          className='form-control my-3'
        />
        {/* {const isSafe = passwordStrength(inputs.user_password).value} */}
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

        <button className='btn-success btn-block' type='submit'>
          Submit
        </button>
      </form>
      <Link to='/login'>Already have an account? Sign in!</Link>

      {successMessage && (
        <Fragment>{successMessage}</Fragment>
      )}
      <Fragment>{errorMessage}</Fragment>
      {/* <ErrorOrSuccess
        successMessage={successMessage}
        errorMessage={errorMessage}
      /> */}
    </Fragment>
  )
}

export default Register
