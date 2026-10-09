// API tests: real HTTP requests to the Express app, against the test database
const request = require('supertest');
const app = require('../app');
const { PASSWORD, resetDatabase, createUser, pool } = require('./helpers');

beforeEach(resetDatabase);
afterAll(() => pool.end());

describe('GET /api/health', () => {
  test('reports that the API is running', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/running/);
  });
});

describe('POST /api/auth/register', () => {
  test('creates a student and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New Student', email: 'New@Example.com', password: PASSWORD });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({ email: 'new@example.com', role: 'student' });
  });

  test('ignores a role sent by the client, so nobody can register as a teacher', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Sneaky', email: 'sneaky@example.com', password: PASSWORD, role: 'teacher' });

    expect(res.status).toBe(201);
    const [[user]] = await pool.query('SELECT role FROM users WHERE email = ?', ['sneaky@example.com']);
    expect(user.role).toBe('student');
  });

  test('rejects a password shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Short', email: 'short@example.com', password: '123' });
    expect(res.status).toBe(400);
  });

  test('rejects an email that is already registered', async () => {
    await createUser('Alice', 'alice@example.com', 'student');
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice Again', email: 'alice@example.com', password: PASSWORD });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  test('returns a token for the correct password', async () => {
    await createUser('Teacher', 'teacher@example.com', 'teacher');
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teacher@example.com', password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined(); // the hash must never be sent back
  });

  test('gives the same error for a wrong password and an unknown email', async () => {
    await createUser('Teacher', 'teacher@example.com', 'teacher');
    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teacher@example.com', password: 'wrong-password' });
    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: PASSWORD });

    expect(wrongPassword.status).toBe(400);
    expect(unknownEmail.status).toBe(400);
    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });
});

describe('GET /api/auth/profile', () => {
  test('rejects a request with no token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  test('rejects a forged token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
