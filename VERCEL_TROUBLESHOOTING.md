# Vercel Deployment Troubleshooting Guide

## 🔴 Current Issue: Deployment Failing

### Root Cause
The most common issue is **Root Directory not set correctly** in Vercel dashboard.

## ✅ Fixes Applied

### 1. Fixed `vercel.json`
- ❌ Removed `buildCommand`, `installCommand`, `framework`, `outputDirectory` (Vercel auto-detects these)
- ❌ Removed `rewrites` (already in `next.config.mjs`, causes conflicts)
- ✅ Kept only `headers` (works better in `vercel.json`)

### 2. Created `.vercelignore`
- Excludes `Dockerfile` (prevents Vercel from trying Docker build)
- Excludes unnecessary files from deployment

### 3. Fixed `next.config.mjs`
- Removed `turbopack.root` (Vercel handles workspace root automatically)
- Custom root setting conflicts with Vercel's build system

## 🚨 CRITICAL: Vercel Dashboard Settings

### Step 1: Set Root Directory (MOST IMPORTANT!)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Set it to: `frontend`
6. Click **Save**

**Without this, Vercel will try to build from the repository root and fail!**

### Step 2: Verify Build Settings

In **Settings** → **General**, verify:

- **Framework Preset**: `Next.js` (should be auto-detected)
- **Build Command**: Leave empty (Vercel auto-detects `npm run build`)
- **Output Directory**: Leave empty (Vercel auto-detects `.next`)
- **Install Command**: Leave empty (Vercel auto-detects `npm install`)
- **Node.js Version**: `20.x` (matches `package.json` engines)

### Step 3: Environment Variables

In **Settings** → **Environment Variables**, ensure:

**Production:**
```
NEXT_PUBLIC_API_URL=https://api.scorenews.net
NEXT_PUBLIC_WS_URL=wss://api.scorenews.net
```

**Preview:**
```
NEXT_PUBLIC_API_URL=https://api.scorenews.net
NEXT_PUBLIC_WS_URL=wss://api.scorenews.net
```

**Development:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

## 🔍 How to Check Build Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on the failed deployment
5. Click **View Build Logs**
6. Look for specific error messages

## 🐛 Common Errors & Solutions

### Error: "Build failed"
**Cause**: Root Directory not set  
**Solution**: Set Root Directory to `frontend` in Vercel settings

### Error: "Cannot find module"
**Cause**: Building from wrong directory  
**Solution**: Set Root Directory to `frontend`

### Error: "Docker build failed"
**Cause**: Vercel detecting Dockerfile  
**Solution**: `.vercelignore` now excludes Dockerfile (already fixed)

### Error: "Environment variable not found"
**Cause**: Variables not set in Vercel  
**Solution**: Add environment variables in Vercel dashboard

### Error: "TypeScript errors"
**Cause**: Type errors in code  
**Solution**: Run `npm run type-check` locally and fix errors

### Error: "Build timeout"
**Cause**: Build taking too long  
**Solution**: Optimize build, check for large dependencies

## 📝 Verification Steps

After applying fixes:

1. ✅ Commit and push changes:
   ```bash
   git add frontend/vercel.json frontend/.vercelignore frontend/next.config.mjs
   git commit -m "Fix: Vercel deployment configuration"
   git push origin developer
   ```

2. ✅ Verify Root Directory is set in Vercel dashboard

3. ✅ Check deployment logs in Vercel dashboard

4. ✅ If still failing, check build logs for specific error

## 🎯 Expected Result

After setting Root Directory to `frontend`:
- ✅ Build should complete successfully
- ✅ All routes should generate correctly
- ✅ Deployment should succeed

## 📞 Still Having Issues?

If deployment still fails after:
1. Setting Root Directory to `frontend`
2. Verifying environment variables
3. Checking build logs

Share the specific error message from Vercel build logs for further assistance.

