const express = require('express');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { verifyToken } = require('./authRoutes');
const router = express.Router();

// Middleware to check if user is a teacher
const requireTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
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
    const students = await User.find({ role: 'student' }).select('-password');
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
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    // Set time to start of day for consistent date comparison
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        const { studentId, status } = record;

        // Validate student exists
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
          errors.push(`Invalid student ID: ${studentId}`);
          continue;
        }

        // Check if attendance already exists for this student and date
        const existingAttendance = await Attendance.findOne({
          student: studentId,
          date: {
            $gte: attendanceDate,
            $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = status;
          existingAttendance.markedBy = teacherId;
          await existingAttendance.save();
          results.push({
            studentId,
            studentName: student.name,
            status,
            action: 'updated'
          });
        } else {
          // Create new attendance record
          const attendance = new Attendance({
            student: studentId,
            date: attendanceDate,
            status,
            markedBy: teacherId
          });
          await attendance.save();
          results.push({
            studentId,
            studentName: student.name,
            status,
            action: 'created'
          });
        }
      } catch (error) {
        console.error(`Error processing attendance for student ${record.studentId}:`, error);
        errors.push(`Error processing student ${record.studentId}: ${error.message}`);
      }
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

    // Validate student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = endDateTime;
      }
    }

    const attendanceRecords = await Attendance.find({
      student: studentId,
      ...dateFilter
    })
    .populate('markedBy', 'name email')
    .sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const absentDays = totalDays - presentDays;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage: parseFloat(attendancePercentage)
      },
      records: attendanceRecords
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
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendanceRecords = await Attendance.find({
      date: {
        $gte: queryDate,
        $lt: nextDay
      }
    }).populate('student', 'name email');

    res.json({
      date: queryDate,
      records: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
});

module.exports = router;