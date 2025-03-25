import express from 'express'
import pg from 'pg'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import pool from '../db.js'
import generateTokens from '../utils/jwt-helper.js'
import validInfo from '../middleware/validInfo.js'
import authorization from '../middleware/authorization.js'

// Create a router instance to handle authentication-related routes (register, login, logout, etc.)
const authenticationRouter = express.Router()

// CRUD Operations

// POST request to register a new user
authenticationRouter.post(
  '/register',
  validInfo,

  async (req, res) => {
    try {
      const { user_email, user_name, user_password, is_admin } = req.body

      // Check if user exists already in database
      const user = await pool.query(
        'SELECT * FROM users WHERE user_email = $1',
        [user_email]
      )

      if (user.rows.length > 0) {
        return res.status(401).json({ message: 'User already exists!' })
      }
      // encrypt user password by using bcrypt middleware
      const hashedPassword = await bcrypt.hash(user_password, 10)
      // create a new user object by using the user input and insert it into the database
      const newUser = await pool.query(
        'INSERT INTO users(user_email, user_name, user_password, is_admin) VALUES ($1, $2, $3, $4) RETURNING*',
        [user_email, user_name, hashedPassword, is_admin]
      )
      // generate access token for the new user by using the helper function generateTokens
      const { accessToken } = await generateTokens(newUser.rows[0].user_id)
      // send the accessToken as response to the client
      res
        .status(200)
        .json({ message: 'User registered successfully!', accessToken })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// POST request to login a user
// Use the validInfo middleware to validate the user input
authenticationRouter.post('/login', validInfo, async (req, res) => {
  try {
    const { user_email, user_password } = req.body
    // Check if user exists in the database
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      user_email,
    ])

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'User not found! Password or Email is incorrect.' })
    }
    // Check if the given password matches the encrypted password in the database by using bcrypt compare function
    const isValidPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    )
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' })
    }
    // generate access token and refresh token for the verified user by using the helper function generateTokens
    const { accessToken, refreshToken } = await generateTokens(
      user.rows[0].user_id,
      user.rows[0].is_admin
    )
    // send a response to the client
    res
      .status(200)
      // set the access token as a header in the client ** NOT NEEDED BECAUSE OF CLIENT SIDE AXIOS INSTANCE **
      // .header('Authorization', accessToken)
      // set the refresh token as a cookie in the client
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000), // 1 hour
        secure: true,
      })
      .json({ message: 'User logged in successfully', accessToken })
  } catch (error) {
    console.log(error)
  }
})

authenticationRouter.get('/logout', authorization, async (req, res) => {
  try {
    res.clearCookie('refreshToken')
    res.json({ message: 'User logged out successfully' })
  } catch (error) {
    console.log(error)
  }
})

// POST request to check if the user is verified by using the authorization middleware
authenticationRouter.post('/is_verified', authorization, async (req, res) => {
  try {
    // if the authorization process is successful, send a response to the client ('true' in this case)
    res.json(true)
  } catch (error) {
    console.log(error.response.data)
    res.status(500).json({ message: error.response.data.message })
  }
})

export default authenticationRouter
