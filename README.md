# Attendance Management System

A full-stack web application for teachers to mark and track student attendance, built with **React (TypeScript)**, **Node.js / Express** and **MySQL**.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## Features

- **Teacher login** with JWT authentication and bcrypt-hashed passwords
- **Role-based access**: only teachers can view students and mark attendance
- **Mark attendance** for any date, per student or with "Mark all present / absent"
- **Edit past attendance**: picking a date loads what was already saved, and re-submitting updates it instead of creating duplicates
- **Live counts** of present, absent and total students while marking
- **Student report API** with total days, present days and attendance percentage, with an optional date range

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 with TypeScript, React Router, Axios, CSS3 |
| Backend | Node.js, Express.js |
| Database | MySQL 8 (`mysql2` driver, parameterized queries) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| Other | `cors`, `dotenv` |

## Architecture

```
React (localhost:3000)  ──HTTP + JSON, Bearer token──▶  Express API (localhost:5000)  ──SQL──▶  MySQL
```

- The React app calls the API through one Axios instance. A request interceptor adds the JWT to every call; a response interceptor logs the user out on a `401`.
- Express routes are protected by two middleware functions: `verifyToken` (is the user logged in?) and `requireTeacher` (is the user a teacher?).

## Database Schema

See [`backend/database/schema.sql`](backend/database/schema.sql).

**users**

| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | |
| email | VARCHAR(255), UNIQUE | stored lowercase |
| password | VARCHAR(255) | bcrypt hash |
| role | ENUM('teacher','student') | |
| created_at, updated_at | TIMESTAMP | |

**attendance**

| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| student_id | INT, FK → users.id | ON DELETE CASCADE |
| date | DATE | |
| status | ENUM('Present','Absent') | |
| marked_by | INT, FK → users.id | teacher who marked it |
| created_at, updated_at | TIMESTAMP | |

`UNIQUE (student_id, date)` guarantees one record per student per day. Marking attendance uses a single bulk
`INSERT ... ON DUPLICATE KEY UPDATE`, so re-submitting a date updates the existing rows.

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new **student** account |
| POST | `/login` | Public | Log in, returns a JWT and the user |
| GET | `/profile` | Logged in | Current user's profile |

### Attendance (`/api/attendance`)
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/students` | Teacher | List all students |
| POST | `/mark` | Teacher | Mark attendance: `{ date: "YYYY-MM-DD", attendanceData: [{ studentId, status }] }` |
| GET | `/by-date?date=YYYY-MM-DD` | Teacher | All records for one date |
| GET | `/report/:studentId?startDate=&endDate=` | Logged in | One student's records and statistics |

`GET /api/health` returns a simple status message.

## Project Structure

```
attendance_system/
├── backend/
│   ├── config/db.js              # MySQL connection pool
│   ├── database/schema.sql       # Table definitions
│   ├── routes/authRoutes.js      # Register, login, profile, verifyToken middleware
│   ├── routes/attendanceRoutes.js# Students, mark, report, by-date, requireTeacher middleware
│   ├── seedData.js               # Creates a demo teacher and 5 students
│   ├── server.js                 # Express app setup
│   └── .env.example
└── frontend/
    └── src/
        ├── components/           # Login, Dashboard, ProtectedRoute
        ├── contexts/AuthContext.tsx  # Global login state (React Context)
        ├── services/api.ts       # Axios instance, API calls, TypeScript types
        └── App.tsx               # Routes
```

## Running Locally

### Prerequisites
- Node.js 18 or later
- MySQL 8

### 1. Create the database
Run `backend/database/schema.sql` in MySQL Workbench, or:
```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Start the backend
```bash
cd backend
npm install
cp .env.example .env    # then set DB_PASSWORD and JWT_SECRET
npm run seed            # demo teacher + 5 students
npm start               # http://localhost:5000
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm start               # http://localhost:3000
```

### 4. Log in
- **Email:** teacher@example.com
- **Password:** password123

## Environment Variables

**backend/.env**
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_system
JWT_SECRET=a_long_random_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000   # allowed CORS origin in production
```

**frontend** (only needed when the API is not on localhost:5000)
```
REACT_APP_API_URL=https://your-api-host/api
```

## Security

- Passwords are hashed with bcrypt (10 salt rounds); hashes are never returned by the API.
- All SQL uses `?` placeholders (parameterized queries) to prevent SQL injection.
- Public registration always creates a student; the role sent by the client is ignored, so users cannot make themselves teachers.
- Login returns the same error for an unknown email and a wrong password.
- CORS only allows the configured frontend origin.

## Future Improvements

- Admin-only endpoint for creating teacher accounts
- Student login to view their own attendance (restrict `/report` to the student themself or a teacher)
- Attendance reports page with charts and CSV export
- Classes / sections, so each teacher sees only their students
- Rate limiting on login, and automated tests
