
// Middleware to validate user input for registration and login
const validInfo = (req, res, next) => {
  const { user_name, user_email, user_password } = req.body
  
  const validEmail = (user_email) => {
    // Use a regular expression to validate the email address
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)
  }

  const validPassword = () => {
    // Use a regular expression to validate the password
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/.test(
      user_password
    )
  }
  // Check if the request body contains the required fields in the register or login form. If not, return an appropriate error message
   if (req.path === '/register') {
     if (![user_email, user_name, user_password].every(Boolean)) {
       return res.status(401).json({message: 'Missing Credentials'})
     }  else if (!validEmail(user_email)) {
       return res.status(401).json({message: 'Invalid Email'})
     } else if(!validPassword(user_password)) {
       return res.status(401).json({message: 'Invalid Password'})
     }
   } else if (req.path === '/login') {
     if (![user_email, user_password].every(Boolean)) {
       return res.status(401).json({ message: 'Missing Credentials' })
     }  if (!validEmail(user_email)) {
       return res.status(401).json({ message: 'Invalid Email' })
     }  if(!validPassword()) {
       return res.status(401).json({message: 'Invalid Password'})
     }
   }
   // If all checks pass, call the next middleware or route handler
  next()
}

export default validInfo