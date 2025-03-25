import pg from 'pg'
const { Pool } = pg;
import 'dotenv/config'

// Database connection 

// Establish a connection pool to PostgreSQL database with credentials from .env file
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
})

export default pool;