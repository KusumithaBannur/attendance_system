require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create a teacher
    const teacher = new User({
      name: 'John Teacher',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    });
    await teacher.save();
    console.log('Created teacher:', teacher.email);

    // Create sample students
    const students = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Edward Wilson',
        email: 'edward@example.com',
        password: 'password123',
        role: 'student'
      }
    ];

    for (const studentData of students) {
      const student = new User(studentData);
      await student.save();
      console.log('Created student:', student.email);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Teacher: teacher@example.com / password123');
    console.log('\n👥 Students created:');
    students.forEach(student => {
      console.log(`- ${student.name} (${student.email})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();