# ⚡ Quick Start Guide

## 🚀 Run Locally (5 Minutes)

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Steps

1. **Clone & Navigate**
   ```bash
   git clone <your-repo-url>
   cd attendance-system
   ```

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run seed
   npm start
   ```
   ✅ Backend running on http://localhost:5000

4. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   ✅ Frontend running on http://localhost:3000

5. **Login**
   - Email: `teacher@example.com`
   - Password: `password123`

---

## 🌐 Deploy to Production

### 1. MongoDB Atlas
- Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- Get connection string

### 2. Deploy Backend (Render)
- Push to GitHub
- Create Web Service on [Render](https://render.com)
- Set environment variables
- Deploy

### 3. Deploy Frontend (Vercel)
- Update API URL in `frontend/src/services/api.ts`
- Create project on [Vercel](https://vercel.com)
- Deploy

📖 **Full guides**: [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md) | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Start MongoDB service |
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| npm install fails | `npm cache clean --force` |
| Frontend won't start | Check Node.js version (18+) |

**Need help?** Check the detailed guides above! 🚀