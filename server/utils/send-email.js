import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import mjml2html from 'mjml'
import 'dotenv/config'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)
// console.log(oAuth2Client)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const generateFiveDigitCode = () => {
  const number = Math.floor(Math.random() * 100000).toString()
  // Ensure the number is always 5 digits long by padding with leading zeros
  return number.toString().padStart(5, '0')
}

const sendMail = async (to, name, type) => {
  try {
    // console.log(await oAuth2Client.getAccessToken())
    const accessToken = await oAuth2Client.getAccessToken()

    const passkey = generateFiveDigitCode()
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.FROM_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    })
    
    
    let html, subject, text
    if (type === 'registration') {
      subject = 'Registration Confirmation'
      text = `Hello ${name}, Thank you for signing up! We are glad to have you on board. Click the button below to confirm.`
      html = `
        <h1>Hello ${name}, Thank you for signing up!</h1>
        <br />
        <p>We are glad to have you on board.</p>
         <p>Click the button below to confirm</p>
        <a href="http://localhost:5173/login" style="text-decoration: none;">
           <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Click Me
           </button>
        </a>
       `
    } else if (type === 'login') {
      subject = 'Login Notification'
      text = `Hello ${name}, You have successfully logged in. Your one-time passkey is: ${passkey}`
      html = `
      <div style="display: flex; flex-direction: column; align-items: center; border: .5px solid lightgrey; justify-content: center; text-align: center; padding: 20px;">
      <h1>Hello ${name},</h1>
        <p>You have successfully logged in. Your one-time passkey is:</p> 
        <a href="http://localhost:5173/dashboard" style="text-decoration: none;">
           <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            ${passkey}
           </button>
        </a>
      </div>
     
        
      `
     
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    }
    const result = await transporter.sendMail(mailOptions)

    return { result, passkey, mailOptions }
  } catch (error) {
    console.log(error)
  }
}

export default sendMail
