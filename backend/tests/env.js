// Runs before every test file, before any app code is loaded.
// Reads DB credentials from .env locally (or from CI environment variables),
// but always points the app at a separate test database.
require('dotenv').config({ quiet: true });

process.env.DB_NAME = process.env.TEST_DB_NAME || 'attendance_system_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
