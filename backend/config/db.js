const mysql = require('mysql2/promise');

// A pool keeps a few connections open and reuses them across requests
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'attendance_system',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // return DATE columns as 'YYYY-MM-DD' strings, not JS Date objects
});

// Check the connection once at startup
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`MySQL Connected: ${connection.config.host}/${connection.config.database}`);
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
