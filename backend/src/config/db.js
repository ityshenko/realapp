const { Pool } = require('pg');
const dbConfig = require('../config/database');

let pool;

try {
  pool = new Pool(dbConfig[process.env.NODE_ENV || 'development']);

  pool.on('connect', () => {
    console.log('✅ Database connected successfully');
  });

  pool.on('error', (err) => {
    console.error('❌ Database pool error:', err.message);
  });
} catch (error) {
  console.warn('⚠️  Database not configured - running without PostgreSQL');
  console.warn('   Some features will not work until database is set up');
}

// Helper function to execute queries
const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed:', { text, duration, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

// Helper function to get a client from the pool
const getClient = async () => {
  if (!pool) {
    throw new Error('Database connection not available');
  }
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const release = client.release.bind(client);
  
  client.query = async (text, params) => {
    const start = Date.now();
    try {
      const result = await originalQuery(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log('Client query executed:', { text, duration, rows: result.rowCount });
      }
      return result;
    } catch (error) {
      console.error('Client query error:', error.message);
      throw error;
    }
  };
  
  client.release = () => {
    client.query = originalQuery;
    client.release = release;
    return release();
  };
  
  return client;
};

module.exports = {
  pool,
  query,
  getClient,
};
