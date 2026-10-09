require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, connectDB } = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (attendance first, because it references users)
    await pool.query('DELETE FROM attendance');
    await pool.query('DELETE FROM users');
    await pool.query('ALTER TABLE attendance AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      ['John Teacher', 'teacher@example.com', 'teacher'],
      ['Alice Johnson', 'alice@example.com', 'student'],
      ['Bob Smith', 'bob@example.com', 'student'],
      ['Charlie Brown', 'charlie@example.com', 'student'],
      ['Diana Prince', 'diana@example.com', 'student'],
      ['Edward Wilson', 'edward@example.com', 'student']
    ];

    // Insert all users in one query
    await pool.query(
      'INSERT INTO users (name, email, role, password) VALUES ?',
      [users.map(user => [...user, hashedPassword])]
    );

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Teacher: teacher@example.com / password123');
    console.log('\n👥 Students created:');
    users.filter(u => u[2] === 'student').forEach(([name, email]) => {
      console.log(`- ${name} (${email})`);
    });

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
