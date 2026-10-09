const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('./authRoutes');
const router = express.Router();

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Today's date as 'YYYY-MM-DD' in the server's local time
const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

// Middleware to check if user is a teacher
const requireTeacher = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.userId]);
    const user = rows[0];
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }
    req.teacher = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students
router.get('/students', verifyToken, requireTeacher, async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE role = 'student' ORDER BY name"
    );
    res.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// Mark attendance for students
router.post('/mark', verifyToken, requireTeacher, async (req, res) => {
  try {
    const { attendanceData, date } = req.body;
    const teacherId = req.userId;

    // Validate input
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    const attendanceDate = date || today();
    if (!DATE_PATTERN.test(attendanceDate)) {
      return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
    }

    // Fetch all the students in one query instead of one query per student
    const studentIds = attendanceData.map(record => record.studentId);
    const [students] = await pool.query(
      "SELECT id, name FROM users WHERE role = 'student' AND id IN (?)",
      [studentIds]
    );
    const studentNames = new Map(students.map(s => [s.id, s.name]));

    const rows = [];
    const results = [];
    const errors = [];

    for (const { studentId, status } of attendanceData) {
      if (!studentNames.has(Number(studentId))) {
        errors.push(`Invalid student ID: ${studentId}`);
        continue;
      }
      if (status !== 'Present' && status !== 'Absent') {
        errors.push(`Invalid status for student ${studentId}: ${status}`);
        continue;
      }
      rows.push([studentId, attendanceDate, status, teacherId]);
      results.push({ studentId, studentName: studentNames.get(Number(studentId)), status });
    }

    // Insert every row at once. If a (student_id, date) row already exists,
    // the UNIQUE key makes MySQL update it instead of creating a duplicate.
    if (rows.length > 0) {
      await pool.query(
        `INSERT INTO attendance (student_id, date, status, marked_by)
         VALUES ? AS new
         ON DUPLICATE KEY UPDATE status = new.status, marked_by = new.marked_by`,
        [rows]
      );
    }

    res.json({
      message: 'Attendance marking completed',
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error while marking attendance' });
  }
});

// Get attendance report for a specific student
router.get('/report/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Teachers can see any report; students can only see their own
    const [requesterRows] = await pool.query('SELECT role FROM users WHERE id = ?', [req.userId]);
    const requester = requesterRows[0];
    if (!requester || (requester.role !== 'teacher' && Number(studentId) !== req.userId)) {
      return res.status(403).json({ message: 'You can only view your own attendance report' });
    }

    // Validate student exists
    const [studentRows] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ? AND role = 'student'",
      [studentId]
    );
    const student = studentRows[0];
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Build the optional date filter
    let dateFilter = '';
    const params = [studentId];
    if (startDate) {
      dateFilter += ' AND a.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      dateFilter += ' AND a.date <= ?';
      params.push(endDate);
    }

    // Records, with the name of the teacher who marked each one
    const [records] = await pool.query(
      `SELECT a.id, a.date, a.status, t.name AS markedByName, t.email AS markedByEmail
       FROM attendance a
       JOIN users t ON t.id = a.marked_by
       WHERE a.student_id = ?${dateFilter}
       ORDER BY a.date DESC`,
      params
    );

    // Statistics calculated by MySQL
    const [[stats]] = await pool.query(
      `SELECT COUNT(*) AS totalDays,
              COALESCE(SUM(a.status = 'Present'), 0) AS presentDays
       FROM attendance a
       WHERE a.student_id = ?${dateFilter}`,
      params
    );

    const totalDays = Number(stats.totalDays);
    const presentDays = Number(stats.presentDays);
    const attendancePercentage = totalDays > 0 ? Number(((presentDays / totalDays) * 100).toFixed(2)) : 0;

    res.json({
      student,
      statistics: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        attendancePercentage
      },
      records
    });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ message: 'Server error while fetching attendance report' });
  }
});

// Get attendance for a specific date
router.get('/by-date', verifyToken, requireTeacher, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !DATE_PATTERN.test(date)) {
      return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
    }

    const [records] = await pool.query(
      `SELECT a.id, a.student_id AS studentId, u.name AS studentName, u.email AS studentEmail, a.status, a.date
       FROM attendance a
       JOIN users u ON u.id = a.student_id
       WHERE a.date = ?
       ORDER BY u.name`,
      [date]
    );

    res.json({ date, records });
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
});

module.exports = router;
