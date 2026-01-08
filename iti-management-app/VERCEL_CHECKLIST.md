# Vercel Deployment Checklist

## ✅ Pre-Deployment (Local Testing)

- [ ] Test frontend locally: `cd frontend && npm start`
- [ ] Test API locally: `cd backend && npm start`
- [ ] Test Import button works
- [ ] Test Search, Filter, Status updates work
- [ ] Run `npm run build` in frontend (check for errors)

## ✅ Before Pushing to GitHub

- [ ] Verify no sensitive data in code
- [ ] Check `.gitignore` excludes `node_modules/`, `build/`, `*.db`
- [ ] `data.json` is in root directory

## ✅ Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## ✅ Vercel Deployment

### Option 1: Deploy Full Project (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your `iti-management-app` repo
4. **Root Directory**: Leave empty (auto-detect)
5. **Framework**: Leave as auto-detected
6. **Build Command**: `cd frontend && npm run build`
7. **Output Directory**: `frontend/build`
8. **Environment Variables**: (optional, can skip for now)
9. Click "Deploy"

### Option 2: Deploy Frontend Only
If you want just the frontend:
1. In Vercel, select only the `frontend/` folder
2. Build Command: `npm run build`
3. Output Directory: `build`
4. Later, deploy backend separately

## ✅ After Deployment

- [ ] Copy your Vercel URL: `https://YOUR_PROJECT.vercel.app`
- [ ] Visit the URL in browser
- [ ] Test Import button
- [ ] Check browser DevTools → Network for `/api` calls
- [ ] Verify all features work

## ✅ If API Calls Fail

1. Check Vercel Dashboard → "Functions" tab
2. Look for errors in function logs
3. Verify `data.json` exists in deployment
4. Check browser Network tab (what status code?)

## ✅ Environment Variables (Optional)

If you deploy frontend and backend separately, add in Vercel:
```
REACT_APP_API_URL=https://YOUR_BACKEND_URL/api
```

But if deploying whole project: not needed (uses relative `/api` path)

## ✅ Custom Domain (Optional)

After successful deployment:
1. Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `iti-app.yoursite.com`)
3. Follow DNS instructions

## 📝 Notes

- First deployment takes 2-5 minutes
- Subsequent deployments are faster
- You can redeploy anytime by pushing to GitHub
- Vercel shows build logs for debugging
- Free tier supports all features needed for this app

---

**Ready? Start with "Option 1: Deploy Full Project" above!**
