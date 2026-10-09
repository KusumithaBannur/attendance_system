// Runs once before all tests: creates the test database and its tables from schema.sql
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

module.exports = async () => {
  require('./env');
  const dbName = process.env.DB_NAME;

  // Safety check: the tests delete every row, so never run them against the real database
  if (!dbName.endsWith('_test')) {
    throw new Error(`Refusing to run tests against "${dbName}". The test database name must end in _test.`);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  // Reuse schema.sql, minus its CREATE DATABASE / USE lines for the real database
  const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8')
    .split('\n')
    .filter(line => !/^\s*(CREATE DATABASE|USE)\b/i.test(line))
    .join('\n');

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);
  await connection.query(schema);
  await connection.end();
};
