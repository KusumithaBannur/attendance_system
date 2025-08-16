# 🚀 Deployment Guide: Attendance Management System

This guide will help you deploy the Attendance Management System with:
- **Backend**: Render (Node.js API)
- **Frontend**: Vercel (React App)
- **Database**: MongoDB Atlas (Cloud Database)

## 📋 Prerequisites

1. GitHub account
2. Render account (free tier available)
3. Vercel account (free tier available)
4. MongoDB Atlas account (free tier available)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "Attendance System"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster: `attendance-cluster`
5. Click "Create Cluster"

### 1.3 Setup Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `attendance-admin`
5. Generate a secure password (save this!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Setup Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://attendance-admin:<password>@attendance-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add `/attendance_system` before the `?` to specify the database name:
   ```
   mongodb+srv://attendance-admin:yourpassword@attendance-cluster.xxxxx.mongodb.net/attendance_system?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Prepare Your Code
1. Push your code to GitHub (if not already done):
   ```bash
   cd attendance-system
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/attendance-system.git
   git push -u origin main
   ```

### 2.2 Deploy on Render
1. Go to [Render](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `attendance-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Set Environment Variables
In the Render dashboard, go to "Environment" and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://attendance-admin:yourpassword@attendance-cluster.xxxxx.mongodb.net/attendance_system?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://attendance-backend-xxxx.onrender.com`

### 2.5 Seed the Database (Optional)
1. In Render dashboard, go to "Shell"
2. Run: `npm run seed`
3. This will create the demo teacher and students

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Update API URL
1. Update `frontend/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-actual-render-url.onrender.com/api'
     : 'http://localhost:5000/api';
   ```

2. Replace `your-actual-render-url` with your actual Render URL

### 3.2 Update Backend CORS
1. Update `backend/server.js` CORS configuration:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://your-vercel-app.vercel.app'] // Will update after Vercel deployment
       : ['http://localhost:3000'],
     credentials: true
   }));
   ```

### 3.3 Deploy on Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-app-name.vercel.app`

### 3.5 Update CORS (Final Step)
1. Go back to Render dashboard
2. Update the CORS environment variable or redeploy with updated code
3. Replace the Vercel URL in your backend CORS configuration

---

## ✅ Step 4: Test Your Deployment

### 4.1 Test the Application
1. Visit your Vercel URL
2. Login with demo credentials:
   - **Email**: teacher@example.com
   - **Password**: password123
3. Test attendance marking functionality
4. Test logout functionality

### 4.2 Troubleshooting

**Common Issues:**

1. **CORS Errors**: Make sure your Vercel URL is added to backend CORS
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Environment Variables**: Double-check all environment variables in Render
4. **API Calls Failing**: Ensure the API base URL in frontend matches your Render URL

**Check Logs:**
- **Render**: Go to your service → "Logs" tab
- **Vercel**: Go to your project → "Functions" tab → View logs
- **MongoDB**: Go to Atlas → "Database" → "Monitoring"

---

## 🔐 Step 5: Security Considerations

### 5.1 Environment Variables
- Never commit `.env` files to GitHub
- Use strong, unique passwords for MongoDB
- Generate a secure JWT secret (at least 32 characters)

### 5.2 Production Optimizations
- Enable MongoDB Atlas backup
- Set up monitoring and alerts
- Consider upgrading to paid tiers for better performance
- Implement rate limiting for API endpoints

---

## 📱 Step 6: Optional Enhancements

### 6.1 Custom Domain (Vercel)
1. Go to Vercel project settings
2. Add your custom domain
3. Configure DNS records

### 6.2 SSL Certificate
- Both Render and Vercel provide free SSL certificates automatically

### 6.3 Monitoring
- Set up uptime monitoring
- Configure error tracking (e.g., Sentry)

---

## 🎉 Congratulations!

Your Attendance Management System is now live! 

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs in Render and Vercel dashboards
3. Verify all environment variables are set correctly
4. Ensure your MongoDB Atlas cluster is running and accessible

---

## 📝 Quick Reference

### Demo Credentials
- **Teacher**: teacher@example.com / password123

### Important URLs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard

### Key Environment Variables
```bash
# Backend (Render)
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=10000

# Frontend (Vercel) - automatically set
NODE_ENV=production