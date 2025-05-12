import express from 'express'
import cors from 'cors'
import authenticationRouter from './routes/jwtAuth.js'
import dashBoardRouter from './routes/dashboard.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config.js'


// Express server configuration

// Initialize the express app and set up the port number
const app = express()
const PORT = 8000



// Setting up the options for the cors middleware (CORS defines a way for client web applications that are loaded in one domain to interact with resources in a different domain )  
app.use(
  cors({
    // The origin property is set to the URL of the client application
    origin: 'http://localhost:5173',
    // Allowing credentials (cookies) for cross-origin requests
    credentials: true,
  })
)
// Middleware

// Bodyparser middleware to parse JSON requests
app.use(express.json())
// Cookieparser middleware to parse cookies
app.use(cookieParser())


// Multer middleware to handle file uploads

// Routes

// Setting up the express router to use the authentication and dashboard routes
app.use('/auth', authenticationRouter)
app.use('/dashboard', dashBoardRouter)

// Initialize the server on the specified port
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})
