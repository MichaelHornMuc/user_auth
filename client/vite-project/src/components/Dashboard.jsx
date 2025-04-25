import { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserCard from './UserCard'
import UserList from './UserList'
import EditForm from './EditForm'
import ErrorOrSuccess from './ErrorOrSuccess'

const Dashboard = ({
  instance,
  setAuthToken,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  setIsAuthenticated,
  isEditing,
  setIsEditing,
  isRedirected,
  setIsRedirected,
}) => {
  const [user, setUser] = useState({})
  const [users, setUsers] = useState([])
  // const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  console.log(isRedirected)

  const getData = useCallback(async () => {
    try {
      const isVerified = await instance.post('/auth/is_verified')

      if (isVerified.data) {
        const response = await instance.get('/dashboard')

        setUser(response.data.user)
        if (response.data.user.is_admin === true) {
          setUsers(response.data.users)
          setSuccessMessage(response?.data?.message)
        } else {
          setUser(response.data.user)
          setSuccessMessage(response?.data?.message)
        }
        // setSuccessMessage(response?.data?.message)
        setTimeout(() => {
          setSuccessMessage('')
          setErrorMessage('')
        }, 3000)
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response?.data?.message)
    }
  }, [instance, setErrorMessage, setSuccessMessage])

  const logOut = async () => {
    try {
      const response = await instance.get('/auth/logout')
      if (response.data) {
        setAuthToken(null)
        setUser({})
        setSuccessMessage(response.data.message)
        setTimeout(() => {
          setSuccessMessage('')
          // setErrorMessage('')
        }, 3000)
        setIsAuthenticated(false)
        navigate('/login')
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return isRedirected ? (
    <h1>isRedirected</h1>
  ) : isEditing ? (
    <EditForm
      user={user}
      setUser={setUser}
      instance={instance}
      setIsEditing={setIsEditing}
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
      setErrorMessage={setErrorMessage}
      errorMessage={errorMessage}
    />
  ) : (
      <Fragment>
      {user && <h2 className='text-center'>Welcome {user.user_name}</h2>}
      <UserCard
        user={user}
        setUser={setUser}
        setUsers={setUsers}
        users={users}
        isEditing={isEditing}
        instance={instance}
        setIsEditing={setIsEditing}
        setAuthToken={setAuthToken}
      />
      <br />
      <div className='container'>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={() => logOut()}>
          LogOut
        </button>
      </div>
      <div className='container'>
        {successMessage ? (
          <Fragment>{successMessage}</Fragment>
        ) : (
          <Fragment>{errorMessage}</Fragment>
        )}
      </div>
    </Fragment>)

  // return isEditing ? (
  //   <EditForm
  //     user={user}
  //     setUser={setUser}
  //     instance={instance}
  //     setIsEditing={setIsEditing}
  //     successMessage={successMessage}
  //     setSuccessMessage={setSuccessMessage}
  //     setErrorMessage={setErrorMessage}
  //     errorMessage={errorMessage}
  //   />
  // ) : (
  //   <Fragment>
  //     {user && <h2 className='text-center'>Welcome {user.user_name}</h2>}
  //     <UserCard
  //       user={user}
  //       setUser={setUser}
  //       setUsers={setUsers}
  //       users={users}
  //       isEditing={isEditing}
  //       instance={instance}
  //       setIsEditing={setIsEditing}
  //       setAuthToken={setAuthToken}
  //     />
  //     <br />
  //     <div className='container'>
  //       <button
  //         type='button'
  //         className='btn btn-secondary'
  //         onClick={() => logOut()}>
  //         LogOut
  //       </button>
  //     </div>
  //     <div className='container'>
  //       {successMessage ? (
  //         <Fragment>{successMessage}</Fragment>
  //       ) : (
  //         <Fragment>{errorMessage}</Fragment>
  //       )}
  //     </div>
  //   </Fragment>
  // )
}

export default Dashboard
