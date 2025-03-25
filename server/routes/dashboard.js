import pool from '../db.js'
import jwt from 'jsonwebtoken'
import express from 'express'
import authorization from '../middleware/authorization.js'
import validInfo from '../middleware/validInfo.js'
import bcrypt from 'bcrypt'

const dashBoardRouter = express.Router()

dashBoardRouter.get('/', authorization, async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT user_id, user_name, user_email, is_admin FROM users WHERE user_id = $1',
      [req.user.id]
    )

    if (response.rows[0].is_admin === true) {
      const adminResponse = await pool.query(
        'SELECT * FROM users WHERE user_id != $1',
        [req.user.id]
      )
      res.status(200).json({
        message: 'Successfully fetched all users',
        user: response.rows[0],
        users: adminResponse.rows,
      })
    } else {
      res
        .status(200)
        .json({ message: 'Successfully fetched user', user: response.rows[0] })
    }
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .json({ message: 'Verification process failed. Please try again' })
  }
})

dashBoardRouter.delete('/delete', authorization, async (req, res) => {
  try {
    console.log(req.user.id)
    const deletedUser = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING*',
      [req.user.id]
    )
    res.clearCookie('refreshToken')
    res
      .status(200)
      .json({
        message: 'User successfully deleted!',
        user: deletedUser.rows[0],
      })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .json({ message: 'User could not be deleted. Please try again' })
  }
})

dashBoardRouter.put('/update', validInfo, authorization, async (req, res) => {
  try {
    console.log(req)
    const {
      user_name,
      user_email,
      confirm_password_change,
      is_admin,
      new_password,
      confirm_new_password,
      confirm_password_change_with_old_password,
    } = req.body
    
    let updatedUser 
    if (confirm_password_change === 'true') {
      
      const oldPassword = await pool.query('SELECT user_password FROM users WHERE user_id = $1', [req.user.id])
      const checkPasswords = await bcrypt.compare(confirm_password_change_with_old_password, oldPassword.rows[0].user_password)
      console.log(oldPassword, checkPasswords)
      if(checkPasswords !== true) {
        return res.status(401).json({ message: 'Your password input was incorrect. Updating failed, please try again'})
      }
      const newEncryptedPassword = await bcrypt.hash(new_password, 10)
      updatedUser = await pool.query('UPDATE users SET user_name =$1, user_email = $2, is_admin = $3, user_password = $4 WHERE user_id = $5 RETURNING*', [user_name, user_email, is_admin, newEncryptedPassword, req.user.id] )

    } else {
      updatedUser = await pool.query(
        'UPDATE users SET user_name = $1, user_email = $2, is_admin = $3 WHERE user_id = $4 RETURNING*',
      // 'SELECT * FROM users WHERE user_id = $1',
        [user_name, user_email, is_admin, req.user.id]
      )
    }
    if (updatedUser.rows.length > 0) {
      res.status(201).json({
        message: 'User updated successfully',
        updatedUser: updatedUser.rows[0],
      })
    }
  } catch (error) {
    console.log(error) 
    res.status(500).json({ message: 'An error occurred while updating. Please try again'})
  }
})

export default dashBoardRouter
