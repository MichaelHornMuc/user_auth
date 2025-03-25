import jwt from 'jsonwebtoken'
import 'dotenv/config'

// JWT Helper function 

// Function to generate access- and refresh- jsonwebtoken from the given payload object

const generateTokens = (user_id, is_admin) => {
  const payload = {
    user: {
      id: user_id,
      is_admin: is_admin
    }
  }
  // Creating access- and refresh jsonwebtoken with the jwt.sign function
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1h',
  })
  // Return the access- and refresh token
  return {
    accessToken,
    refreshToken,
  }
}

export default generateTokens
