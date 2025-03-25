import React, { Fragment } from 'react'

const UserList = ({ users }) => {
  console.log(users)
  return (
    <Fragment>
      <div className='card'>
        {/* <div className='card-header'>Members & Stuff</div> */}
        {/* <div className='card-body'> */}
        <ul className='card-body list-group list-group-flush p-0'>
          {users.map((user, index) => {
            return (
              <li key={index} className='list-group-item p-3'>
                <div className='card d-flex p-2'>
                  <div className=''>Username: {user.user_name}</div>
                  <div className=''>Email: {user.user_email}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Fragment>
  )
}

export default UserList
