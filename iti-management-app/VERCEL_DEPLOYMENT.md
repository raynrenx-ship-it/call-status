# Vercel Deployment Guide

## Deploy Your ITI Management App to Vercel

This app is now ready to deploy on Vercel with:
- **Frontend**: React app deployed as static site
- **Backend**: Serverless API functions (no Node.js server needed)
- **Data**: JSON file imported on API calls

### Prerequisites
- Vercel account (free at https://vercel.com)
- Git repository on GitHub

### Deployment Steps

#### 1. Push Your Code to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/iti-management-app.git
git push -u origin main
```

#### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..." → "Project"**
4. Select your repository: `iti-management-app`
5. Click **"Import"**

#### 3. Configure Project Settings

In the Vercel dashboard:

**Build & Output Settings:**
- **Framework Preset**: (leave as "Other" - auto-detected)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install`

**Environment Variables:**
- Click **"Environment Variables"**
- Add (optional - can be added later):
  ```
  REACT_APP_API_URL = https://YOUR_VERCEL_PROJECT.vercel.app/api
  ```

#### 4. Deploy

Click **"Deploy"** button. Vercel will:
1. Build the React frontend
2. Deploy API serverless functions
3. Deploy static site
4. Generate URLs

### After Deployment

You'll get:
- **Frontend URL**: `https://YOUR_PROJECT.vercel.app`
- **API URL**: `https://YOUR_PROJECT.vercel.app/api`

The frontend automatically uses `/api` (relative path) which works on Vercel because:
- Frontend and API are on the same domain
- No CORS issues
- No localhost:5000 hardcoding

### Update After Deployment (if needed)

If you want to change the API URL after deployment:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add/update: `REACT_APP_API_URL=https://YOUR_VERCEL_PROJECT.vercel.app/api`
4. Redeploy: Go to "Deployments" → Click latest → "Redeploy"

### API Endpoints (After Deployment)

All requests go to: `https://YOUR_PROJECT.vercel.app/api`

```
GET    /api/itis          - Get all ITIs
GET    /api/itis?id=1     - Get single ITI
POST   /api/itis          - Create ITI
PUT    /api/itis?id=1     - Update ITI status & remarks
DELETE /api/itis?id=1     - Delete ITI
POST   /api/itis?action=import  - Import from data.json
GET    /api/health        - Health check
```

### Local Development (Before Deploying)

Still use the local dev servers:

```bash
# Terminal 1 - Backend (simulates serverless locally)
cd backend
npm start

# Terminal 2 - Frontend with proxy
cd frontend
npm start
```

The frontend proxy still uses `localhost:5000` in development.

### Troubleshooting

**"Cannot find module" error:**
- Make sure `data.json` exists in project root
- Run `npm install` in root directory

**API not working after deployment:**
1. Check Vercel Function logs: Dashboard → Functions → logs
2. Verify `data.json` is included in deployment (check "Files" section)
3. Check browser DevTools → Network tab for actual API response

**CORS errors gone:**
- Serverless functions automatically run on same domain
- No cross-origin issues

### Production Database (Recommended for Real Use)

The current setup stores data in memory. For production:
1. Replace in-memory store with a real database
2. Use Vercel's KV (Redis) or MongoDB Atlas
3. Update `api/itis.js` to use database instead of array

Contact me for database integration if needed.

### File Structure on Vercel

```
Root
├── frontend/          → React app (deployed as static site)
├── api/              → Serverless functions (auto-deployed)
├── data.json         → Loaded by serverless functions
├── vercel.json       → Vercel config
└── package.json      → Root config
```

---

**You're ready to deploy! 🚀**

Questions? Check Vercel docs: https://vercel.com/docs
