import jwt from 'jsonwebtoken'

// Middleware function to check if the user is authorized by checking the access token and refresh token
const authorization = (req, res, next) => {
 
  // Get the access and refresh tokens from the request headers and cookies respectively if they exist
  const refreshToken = req.cookies['refreshToken']
  const accessTokenRaw = req.headers['authorization']
  const accessToken = accessTokenRaw.split(' ')[1]

  // If the access token or refresh token is not provided, return an error message
  if (!refreshToken || !accessToken) {
    return res.status(401).json({ message: 'You have to be logged in to access your profile' })
  }
  try {
    // If there is a accessToken, decode it by using the jwt decode function and set the user object in the request object to to decoded token data
    const decoded = jwt.decode(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded.user
    // Call the next middleware or route handler
    next()
  } catch (error) {
    // If the accessToken is not valid, check if the there is a valid refreshToken
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Access Denied! No refresh token provided' })
    }
    try {
      // If there is a refreshToken, decode it and create a new accessToken by using the jwt sign function and the decoded refresh token data
      const decoded = jwt.decode(refreshToken, process.env.REFRESH_ACCESS_TOKEN)
      const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_SECRET)

      res
      // Set a new cookie with the refreshToken
        .cookie('refreshToken', refreshToken, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        })
        // Set the accessToken as a header in the response object *****
        // .header('Authorization', 'Bearer ' + accessToken)
        req.user = decoded.user
        next()
    } catch (error) {
      return res.status(401).json({ message: 'Access Denied!' })
    }
  }
  
}

export default authorization
