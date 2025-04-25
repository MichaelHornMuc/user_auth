import pool from '../db.js'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import cron from 'node-cron'

const logMessage = () => {
  console.log('Cron job executed at', new Date().toUTCString())
}

const verifyOtp = async(id, opthash, otp) => {
  try {
    const result = await pool.query('SELECT * FROM email_opts WHERE user_id = $1 AND opt_hash = $2', [id, opthash])
    if(result.rows[0].length === 0) {
      return { success: false, message: 'Invalid OTP'}
    }
    if(new Date().toUTCString() > result.rows[0].expires_at) {
      return { success: false, message: 'OTP has expired'}
    }
    const { user_id, opt_hash, expired_at, created_at} = result.rows[0]

    const matchedOPTS = await bcrypt.compare(otp, opt_hash)
    
    if(!matchedOPTS) {
      return { success: false, message: 'Invalid OTP'}
    }
    
      cron.schedule(' */10 * * * *', () => {
        logMessage()
        pool
          .query(
            'DELETE FROM email_opts WHERE user_id = $1 AND opt_hash = $2',
            [user_id, opt_hash]
          )
          .then(() => {
            console.log('OTP deleted successfully')
          })
          .catch((error) => {
            console.log('Error deleting OTP', error)
          })
      })
    
    // cron.schedule(' */5 * * * *', () => {
    //   logMessage()
    //   pool.query('DELETE FROM email_opts WHERE user_id = $1 AND opt_hash = $2', [user_id, opt_hash])
    //   .then(() => {
    //     console.log('OTP deleted successfully')
    //   })
    //   .catch(error => {
    //     console.log('Error deleting OTP', error)
    //   })
    // })
    return { success: true, message: 'OTP verified successfully'}
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error while verifying OTP' }
  }
}

export default verifyOtp