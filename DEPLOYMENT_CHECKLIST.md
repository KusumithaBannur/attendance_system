# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## ✅ Pre-Deployment Checklist

### 📋 Code Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files added to `.gitignore`
- [ ] Environment variables documented in `.env.example`
- [ ] Production-ready CORS configuration
- [ ] API URLs configured for production/development

### 🗄️ Database Setup (MongoDB Atlas)
- [ ] MongoDB Atlas account created
- [ ] Database cluster created (free tier)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (allow all IPs for now)
- [ ] Connection string obtained and tested

### 🔧 Backend Preparation (Render)
- [ ] `package.json` updated with correct Node.js version
- [ ] Start command configured (`npm start`)
- [ ] Environment variables ready:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<your_atlas_connection_string>`
  - [ ] `JWT_SECRET=<secure_random_string>`
  - [ ] `PORT=10000`

### 🌐 Frontend Preparation (Vercel)
- [ ] API base URL configured for production
- [ ] Build command works locally (`npm run build`)
- [ ] No hardcoded localhost URLs

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`
- [ ] Add all environment variables
- [ ] Deploy and verify it's running
- [ ] Test API endpoints (health check)
- [ ] Seed database if needed (`npm run seed`)

### Step 2: Update Frontend Configuration
- [ ] Update API base URL with actual Render URL
- [ ] Test locally with production API
- [ ] Commit and push changes

### Step 3: Deploy Frontend to Vercel
- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Configure build settings (auto-detected)
- [ ] Deploy and verify it's running
- [ ] Test login and functionality

### Step 4: Final Configuration
- [ ] Update backend CORS with actual Vercel URL
- [ ] Redeploy backend with updated CORS
- [ ] Test complete flow end-to-end

## 🧪 Post-Deployment Testing

### Authentication
- [ ] Login page loads correctly
- [ ] Can login with demo credentials
- [ ] JWT token is properly stored
- [ ] Protected routes work correctly
- [ ] Logout functionality works

### Attendance Management
- [ ] Student list loads from database
- [ ] Can mark individual students present/absent
- [ ] Bulk operations work (mark all present/absent)
- [ ] Statistics update in real-time
- [ ] Date selection works
- [ ] Attendance submission works

### Performance & Security
- [ ] Page loads quickly (< 3 seconds)
- [ ] No console errors
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Environment variables secure

## 🔧 Troubleshooting

### Common Issues
- [ ] **CORS errors**: Check backend CORS configuration
- [ ] **API not found**: Verify API base URL in frontend
- [ ] **Database connection**: Check MongoDB Atlas connection string
- [ ] **Build failures**: Check Node.js version compatibility
- [ ] **Environment variables**: Verify all required vars are set

### Where to Check Logs
- [ ] **Render**: Service dashboard → Logs tab
- [ ] **Vercel**: Project dashboard → Functions tab
- [ ] **MongoDB Atlas**: Database → Monitoring tab
- [ ] **Browser**: Developer tools → Console tab

## 📝 URLs to Update

After deployment, update these in your documentation:

```markdown
### Live URLs
- Frontend: https://your-app-name.vercel.app
- Backend: https://your-backend-name.onrender.com
- Database: MongoDB Atlas cluster

### Update These Files
- README.md (live demo links)
- DEPLOYMENT_GUIDE.md (example URLs)
- frontend/src/services/api.ts (production API URL)
- backend/server.js (CORS origins)
```

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] Frontend loads without errors
- [ ] Can login with demo credentials
- [ ] Can view student list
- [ ] Can mark attendance and see real-time updates
- [ ] Can logout successfully
- [ ] All functionality works as in local development
- [ ] No console errors or network failures

## 📞 Need Help?

If you encounter issues:
1. Check this checklist again
2. Review the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Check logs in your hosting platforms
4. Verify all environment variables
5. Test API endpoints directly using tools like Postman

---

**Remember**: Free tier services may take 30-60 seconds to "wake up" if they haven't been used recently. This is normal behavior.