import { Fragment, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import usePasswordToggle from '../utils/togglePassword';
const EditForm = ({ user, setUser, instance, setIsEditing, successMessage, errorMessage, setSuccessMessage, setErrorMessage }) => {
  const [inputs, setInputs] = useState({ ...user })
  const [changePassword, setChangePassword] = useState(false)
  const { showPassword, togglePasswordVisibility} = usePasswordToggle()
    const openEye = <FontAwesomeIcon icon={faEye} />
    const closedEye = <FontAwesomeIcon icon={faEyeSlash} />

  const handleChange = (e) => {
    e.preventDefault()
    try {
      const value = e.target.value
      const name = e.target.name
      setInputs({
        ...inputs,
        [name]: value,
      })
      if (name === 'confirm_password_change') {
        setChangePassword(!changePassword)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const updateBody = await instance.put('/dashboard/update', {
        ...inputs,
        changePassword,
      })
      if (updateBody.data && updateBody.data.updatedUser) {
        setUser(updateBody.data.updatedUser)
        setIsEditing(false)
        setInputs({})
        setSuccessMessage(updateBody.data.message)
      }
      
      console.log(updateBody.data)
    } catch (error) {
      console.log(error)
      setSuccessMessage('')
      setErrorMessage(error.response.data.message)
    }
  }
  const passwords = document.querySelectorAll('.pass')

    console.log(successMessage)

  return (
    <Fragment>
      <h2 className='text-center'>Edit your Profile</h2>

      <form onSubmit={handleSubmit} className='form-group'>
        <label htmlFor='user_name'>Change your name</label>
        <input
          type='text'
          name='user_name'
          placeholder={user.user_name}
          value={inputs.user_name}
          onChange={handleChange}
          className='form-control my-3'
        />
        <label htmlFor='user_email'>Change your email address</label>
        <input
          type='email'
          name='user_email'
          placeholder={user.user_email}
          value={inputs.user_email}
          onChange={handleChange}
          className='form-control my-3'
        />
        <br />
        <label>Change your administrator Privileges.</label>
        <div className='form-check'>
          <label className='form-check-label' htmlFor='defaultCheck1'>
            Still have administrator privileges
          </label>
          <input
            id='defaultCheck1'
            type='radio'
            name='is_admin'
            value='true'
            onChange={handleChange}
            className='form-check-input'
          />
        </div>
        <div className='form-check'>
          <label className='form-check-label' htmlFor='defaultCheck2'>
            No, I no longer have administrator privileges
          </label>
          <input
            id='defaultCheck2'
            type='radio'
            name='is_admin'
            value='false'
            onChange={handleChange}
            className='form-check-input'
          />
        </div>
        <br />
        <div className='form-check'>
          <input
            type='checkbox'
            name='confirm_password_change'
            id='defaultCheck3'
            className='form-check-input'
            onChange={handleChange}
            value='true'
          />
          <label htmlFor='defaultCheck3' className='form-check-label'>
            Want to change your password?
          </label>
        </div>
        <br />
        {}
        {changePassword && (
          <div>
            <label htmlFor='defaultCheck4' className='form-check-label'>
              Provide and confirm your new Password.
            </label>
            <input
              id='defaultCheck4'
              type='password'
              name='new_password'
              className='form-control my-3 pass'
              placeholder='Enter your new password'
              onChange={handleChange}
            />
            <input
              type='password'
              name='confirm_new_password'
              className='form-control pass'
              placeholder='Confirm your new password'
              onChange={handleChange}
            />
            <button
              onClick={() => passwords.forEach(password => {
                togglePasswordVisibility(password)
              })}
              type='button'
              className='btn my-3 btn-info btn-sm'>
              <i id='openEye' name='openEye'>
                {showPassword ? closedEye : openEye}
              </i>
              <label htmlFor='openEye' className='form-label m-2'>
                {showPassword ? 'Hide Password' : 'Show Password'}
              </label>
            </button>
            <small>
              Please ensure that your new password meets the security
              requirements.
            </small>
            <br />
            <div className='my-3'>
              <label htmlFor='defaultCheck5' className='form-check-label'>
                Your current password is required to confirm your change.
              </label>
              <input
                type='password'
                id='defaultCheck5'
                className='form-control'
                name='confirm_password_change_with_old_password'
                onChange={handleChange}
                value={inputs.user_password}
              />
            </div>
          </div>
        )}
        <button className='btn-success btn-block' type='submit'>
          Submit
        </button>
      </form>
      {successMessage && (
              <Fragment>{successMessage}</Fragment>
            )}
            <Fragment>{errorMessage}</Fragment>
    </Fragment>
  )
}

export default EditForm
