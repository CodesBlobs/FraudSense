import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Let the connection string handle SSL if possible, or provide a minimal config
  ssl: process.env.DATABASE_URL?.includes('sslmode=') ? undefined : {
    rejectUnauthorized: false,
  },
});

// Better error handling for idle clients
pool.on('error', (err) => {
  console.error('⚠️  Unexpected error on idle searchshield client:', err.message);
  // Do NOT process.exit(-1) here. The pool will handle recreating 
  // connections on the next request. Exiting crashes the whole server.
});

export default pool;
