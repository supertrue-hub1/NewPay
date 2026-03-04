import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'adminmfo',
  password: process.env.DB_PASSWORD || '546815hH!',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'my_mfo',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

export const queryOne = async (text: string, params?: any[]) => {
  const res = await query(text, params)
  return res.rows[0]
}

export default pool
