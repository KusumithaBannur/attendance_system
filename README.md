# 📚 Attendance Management System

A full-stack web application for managing student attendance built with React.js, Node.js, Express, and MongoDB.

![Attendance System Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🌟 Features

### 🔐 Authentication System
- **Secure Login**: JWT-based authentication with password hashing
- **Role-based Access**: Teacher and student roles with proper validation
- **Session Management**: Automatic logout and token refresh

### 📊 Attendance Management
- **Real-time Dashboard**: Live statistics (Present/Absent/Total counts)
- **Individual Controls**: Mark each student as Present/Absent
- **Bulk Operations**: Mark all students present/absent with one click
- **Date Selection**: Choose specific dates for attendance marking
- **Visual Feedback**: Student cards highlight when attendance changes

### 🎨 User Interface
- **Modern Design**: Professional gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Intuitive Controls**: Clean typography and user-friendly interface
- **Real-time Updates**: Statistics update instantly as you mark attendance

## 🚀 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-backend.onrender.com](https://your-backend.onrender.com)

### Demo Credentials
- **Teacher**: teacher@example.com / password123

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library with TypeScript
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

### Deployment
- **Frontend**: Vercel (Static hosting)
- **Backend**: Render (Node.js hosting)
- **Database**: MongoDB Atlas (Cloud database)

## 📁 Project Structure

```
attendance-system/
├── backend/                 # Node.js API server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── User.js         # User schema (teachers & students)
│   │   └── Attendance.js   # Attendance records schema
│   ├── routes/
│   │   ├── authRoutes.js   # Authentication endpoints
│   │   └── attendanceRoutes.js # Attendance management endpoints
│   ├── server.js           # Express server setup
│   ├── seedData.js         # Database seeding script
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx   # Login page
│   │   │   ├── Dashboard.tsx # Main attendance dashboard
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # Authentication state management
│   │   ├── services/
│   │   │   └── api.ts      # API client configuration
│   │   └── App.tsx         # Main app component
│   └── package.json
├── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
└── README.md               # This file
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/attendance-system.git
cd attendance-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with demo data
npm run seed

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application
1. Open `http://localhost:3000` in your browser
2. Login with demo credentials:
   - **Email**: teacher@example.com
   - **Password**: password123

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deployment Summary

1. **Database**: Setup MongoDB Atlas cluster
2. **Backend**: Deploy to Render with environment variables
3. **Frontend**: Deploy to Vercel with production API URL
4. **Configuration**: Update CORS and API endpoints

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Teacher login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get current user profile

### Attendance Management
- `GET /api/attendance/students` - Get all students
- `POST /api/attendance/mark` - Mark attendance for students
- `GET /api/attendance/report/:studentId` - Get student attendance report
- `GET /api/attendance/by-date?date=YYYY-MM-DD` - Get attendance by date

## 🔐 Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Production Environment
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/attendance_system
JWT_SECRET=your_super_secure_jwt_secret
PORT=10000
```

## 🧪 Testing

The application has been thoroughly tested with:

✅ **Authentication Flow**
- Login with valid credentials
- JWT token generation and validation
- Automatic logout on token expiration

✅ **Attendance Management**
- Individual student attendance marking
- Bulk operations (mark all present/absent)
- Real-time statistics updates
- Date-specific attendance records

✅ **User Interface**
- Responsive design on multiple screen sizes
- Smooth animations and transitions
- Error handling and user feedback

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with demo data
```

#### Frontend
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Proper error handling
- Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🆘 Support

If you encounter any issues:

1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
2. Review the troubleshooting section in the deployment guide
3. Check the logs in your hosting platform dashboards
4. Verify all environment variables are set correctly

## 🎯 Future Enhancements

- [ ] Student login to view their own attendance
- [ ] Attendance reports with date ranges and export to PDF/Excel
- [ ] Email notifications for low attendance
- [ ] Multiple classes/sections support
- [ ] Graphical attendance reports with charts
- [ ] Admin panel for user management
- [ ] Mobile app using React Native
- [ ] Real-time notifications using WebSockets


