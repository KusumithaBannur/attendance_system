import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { attendanceAPI, Student, AttendanceRecord } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: 'Present' | 'Absent' }>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getStudents();
      setStudents(response.students);
      
      // Initialize attendance state with all students marked as Absent
      const initialAttendance: { [key: string]: 'Present' | 'Absent' } = {};
      response.students.forEach((student: Student) => {
        initialAttendance[student._id] = 'Absent';
      });
      setAttendance(initialAttendance);
    } catch (error: any) {
      setError('Failed to fetch students: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const attendanceData: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      const response = await attendanceAPI.markAttendance({
        attendanceData,
        date: selectedDate
      });

      setMessage(`Attendance marked successfully for ${response.results.length} students!`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setError('Failed to mark attendance: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAll = (status: 'Present' | 'Absent') => {
    const newAttendance: { [key: string]: 'Present' | 'Absent' } = {};
    students.forEach(student => {
      newAttendance[student._id] = status;
    });
    setAttendance(newAttendance);
  };

  const getPresentCount = () => {
    return Object.values(attendance).filter(status => status === 'Present').length;
  };

  const getAbsentCount = () => {
    return Object.values(attendance).filter(status => status === 'Absent').length;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Attendance Management Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="attendance-section">
          <div className="section-header">
            <h2>Mark Attendance</h2>
            <div className="date-selector">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="attendance-controls">
            <div className="bulk-actions">
              <button 
                onClick={() => handleSelectAll('Present')} 
                className="bulk-button present-all"
              >
                Mark All Present
              </button>
              <button 
                onClick={() => handleSelectAll('Absent')} 
                className="bulk-button absent-all"
              >
                Mark All Absent
              </button>
            </div>
            
            <div className="attendance-summary">
              <span className="present-count">Present: {getPresentCount()}</span>
              <span className="absent-count">Absent: {getAbsentCount()}</span>
              <span className="total-count">Total: {students.length}</span>
            </div>
          </div>

          <div className="students-list">
            {students.length === 0 ? (
              <div className="no-students">
                No students found. Please add students first.
              </div>
            ) : (
              students.map((student) => (
                <div key={student._id} className="student-card">
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                  </div>
                  <div className="attendance-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="Present"
                        checked={attendance[student._id] === 'Present'}
                        onChange={() => handleAttendanceChange(student._id, 'Present')}
                      />
                      <span className="radio-label present">Present</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="Absent"
                        checked={attendance[student._id] === 'Absent'}
                        onChange={() => handleAttendanceChange(student._id, 'Absent')}
                      />
                      <span className="radio-label absent">Absent</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>

          {students.length > 0 && (
            <div className="submit-section">
              <button
                onClick={handleSubmitAttendance}
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;