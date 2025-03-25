import React, { Fragment, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import EditProfile from './EditForm'
import UserList from './UserList'

const UserCard = ({
  user,
  setUser,
  users,
  setUsers,
  isEditing,
  setIsEditing,
  instance,
  setAuthToken,
}) => {
  const [showUsers, setShowUsers] = useState(false)
  const handleClick = (e) => {
    e.preventDefault()
    setIsEditing(!isEditing)
  }

  let navigate = useNavigate()


  const DeleteUser = async (user_id) => {
    try {
      const userToDelete = await instance.delete('/dashboard/delete', user_id)
    
      if(userToDelete.data && userToDelete.data.user) {
        setAuthToken(null)
        setUsers(users.filter((u) => u.user_id !== user_id))
        setUser({})
        // setTimeout(() => {
          navigate('/login')
          window.location.reload()
        // }, 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
      <div className='container my-3'>
        <div className='card'>
          <div className='card-body d-flex justify-content-between'>
            {/* <Fragment> */}
            <div className='d-flex '>
              <h5 className='card-text me-3'>{user.user_name}</h5>
              <h5 className='card-text ms-3'>{user.user_email}</h5>
            </div>
            <div className='d-flex'>
              <button onClick={handleClick} className='btn btn-info me-2'>
                Edit Profile
              </button>
              <button
                type='button'
                onClick={() => DeleteUser(user.user_id)}
                className='btn btn-danger'>
                Delete Profile
              </button>
            </div>
            {/* </Fragment> */}
          </div>
        </div>
      </div>
      {!showUsers == true ? (
        <div className='container'>
          {/* <button
            type='button'
            className='btn btn-primary me-2'
            onClick={handleClick}>
            Edit Profile
          </button> */}
          {user.is_admin && (
            <button
              type='button'
              className='btn btn-secondary'
              onClick={() => setShowUsers(!showUsers)}>
              Show Profiles
            </button>
          )}
        </div>
      ) : (
        <div className='container'>
          <h3 className='text-left'>All Users</h3>

          <UserList users={users} />

          {/* <UserList users={users}/> */}
        </div>
      )}
    </Fragment>
  )
}

export default UserCard
