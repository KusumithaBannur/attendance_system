const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const PASSWORD = 'password123';

// Empty both tables so every test starts from the same state
const resetDatabase = async () => {
  await pool.query('DELETE FROM attendance');
  await pool.query('DELETE FROM users');
};

// Insert a user directly and return it with a valid login token
const createUser = async (name, email, role) => {
  const hashedPassword = await bcrypt.hash(PASSWORD, 4); // few rounds, to keep tests fast
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET);
  return { id: result.insertId, name, email, role, token };
};

module.exports = { PASSWORD, resetDatabase, createUser, pool };
