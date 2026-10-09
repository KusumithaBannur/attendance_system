// API tests for marking attendance and reading reports
const request = require('supertest');
const app = require('../app');
const { resetDatabase, createUser, pool } = require('./helpers');

let teacher, alice, bob;

beforeEach(async () => {
  await resetDatabase();
  teacher = await createUser('Teacher', 'teacher@example.com', 'teacher');
  alice = await createUser('Alice', 'alice@example.com', 'student');
  bob = await createUser('Bob', 'bob@example.com', 'student');
});
afterAll(() => pool.end());

// Small helpers so each test reads as one step
const mark = (user, date, attendanceData) =>
  request(app)
    .post('/api/attendance/mark')
    .set('Authorization', `Bearer ${user.token}`)
    .send({ date, attendanceData });

const getReport = (user, studentId, query = {}) =>
  request(app)
    .get(`/api/attendance/report/${studentId}`)
    .query(query)
    .set('Authorization', `Bearer ${user.token}`);

describe('GET /api/attendance/students', () => {
  test('a teacher gets the list of students', async () => {
    const res = await request(app)
      .get('/api/attendance/students')
      .set('Authorization', `Bearer ${teacher.token}`);

    expect(res.status).toBe(200);
    expect(res.body.students.map(s => s.name)).toEqual(['Alice', 'Bob']);
  });

  test('a student is denied', async () => {
    const res = await request(app)
      .get('/api/attendance/students')
      .set('Authorization', `Bearer ${alice.token}`);
    expect(res.status).toBe(403);
  });
});

describe('POST /api/attendance/mark', () => {
  test('saves attendance for each student', async () => {
    const res = await mark(teacher, '2026-10-01', [
      { studentId: alice.id, status: 'Present' },
      { studentId: bob.id, status: 'Absent' }
    ]);

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(2);
  });

  test('re-marking the same day updates the record instead of duplicating it', async () => {
    await mark(teacher, '2026-10-01', [{ studentId: alice.id, status: 'Absent' }]);
    await mark(teacher, '2026-10-01', [{ studentId: alice.id, status: 'Present' }]);

    const [rows] = await pool.query('SELECT status FROM attendance WHERE student_id = ?', [alice.id]);
    expect(rows).toEqual([{ status: 'Present' }]);
  });

  test('reports invalid students and statuses without saving them', async () => {
    const res = await mark(teacher, '2026-10-01', [
      { studentId: 99999, status: 'Present' },
      { studentId: alice.id, status: 'Late' }
    ]);

    expect(res.body.errors).toHaveLength(2);
    const [rows] = await pool.query('SELECT * FROM attendance');
    expect(rows).toHaveLength(0);
  });

  test('rejects a badly formatted date', async () => {
    const res = await mark(teacher, '01-10-2026', [{ studentId: alice.id, status: 'Present' }]);
    expect(res.status).toBe(400);
  });

  test('a student cannot mark attendance', async () => {
    const res = await mark(alice, '2026-10-01', [{ studentId: alice.id, status: 'Present' }]);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/attendance/report/:studentId', () => {
  beforeEach(async () => {
    await mark(teacher, '2026-10-01', [{ studentId: alice.id, status: 'Present' }]);
    await mark(teacher, '2026-10-02', [{ studentId: alice.id, status: 'Present' }]);
    await mark(teacher, '2026-10-03', [{ studentId: alice.id, status: 'Absent' }]);
    await mark(teacher, '2026-10-04', [{ studentId: alice.id, status: 'Present' }]);
  });

  test('a teacher gets the statistics and records for any student', async () => {
    const res = await getReport(teacher, alice.id);

    expect(res.status).toBe(200);
    expect(res.body.statistics).toEqual({
      totalDays: 4,
      presentDays: 3,
      absentDays: 1,
      attendancePercentage: 75
    });
    expect(res.body.records[0].date).toBe('2026-10-04'); // newest first
  });

  test('a student can see their own report', async () => {
    const res = await getReport(alice, alice.id);
    expect(res.status).toBe(200);
  });

  test("a student cannot see another student's report", async () => {
    const res = await getReport(bob, alice.id);
    expect(res.status).toBe(403);
  });

  test('filters the report by startDate and endDate', async () => {
    const res = await getReport(teacher, alice.id, {
      startDate: '2026-10-02',
      endDate: '2026-10-03'
    });

    expect(res.status).toBe(200);
    expect(res.body.statistics).toEqual({
      totalDays: 2,
      presentDays: 1,
      absentDays: 1,
      attendancePercentage: 50
    });
    expect(res.body.records).toHaveLength(2);
  });
});
