-- Attendance Management System - MySQL schema
-- Run this once (MySQL Workbench or: mysql -u root -p < database/schema.sql)

CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Teachers and students share one table, told apart by role
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,          -- bcrypt hash, never plain text
  role       ENUM('teacher', 'student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- One row = one student's status on one day
CREATE TABLE IF NOT EXISTS attendance (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date       DATE NOT NULL,                  -- DATE only, no time, so no time zone issues
  status     ENUM('Present', 'Absent') NOT NULL DEFAULT 'Absent',
  marked_by  INT NOT NULL,                   -- the teacher who marked it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- A student can have only one record per day
  UNIQUE KEY unique_student_date (student_id, date),

  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by)  REFERENCES users(id)
);
