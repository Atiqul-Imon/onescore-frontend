# Vercel CI/CD Build Fix Guide

## Common Issues with Next.js 16 on Vercel

### Issue 1: Workspace Root Warning

**Problem**: Next.js 16 detects multiple lockfiles and shows warning:
```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles and selected the directory of /home/atiqul-islam/Cricinfo-main/package-lock.json as the root directory.
```

**Solution**: Already fixed in `next.config.mjs`:
```javascript
turbopack: {
  root: __dirname,
},
```

### Issue 2: Build Command in Vercel

**Problem**: Vercel might be using default build settings that don't match your setup.

**Solution**: Ensure `vercel.json` has correct configuration:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Issue 3: Root Directory Configuration

**Problem**: If your project has a root `package-lock.json`, Vercel might try to build from root.

**Solution**: In Vercel Dashboard:
1. Go to **Project Settings** → **General**
2. Set **Root Directory** to `frontend`
3. This tells Vercel to build from the `frontend` directory

### Issue 4: Environment Variables

**Problem**: Missing environment variables in Vercel can cause build failures.

**Required Variables**:
```
NEXT_PUBLIC_API_URL=https://api.scorenews.net
NEXT_PUBLIC_WS_URL=wss://api.scorenews.net
```

**Solution**: 
1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Add all required variables for **Production**, **Preview**, and **Development**

### Issue 5: Build Timeout

**Problem**: Large builds can timeout on Vercel.

**Solution**: Optimize build:
- Use `--webpack` flag if Turbopack is causing issues
- Or configure Turbopack properly in `next.config.mjs`

### Issue 6: TypeScript/ESLint Errors

**Problem**: TypeScript or ESLint errors can fail the build.

**Solution**: 
- Ensure `typescript.ignoreBuildErrors: false` (strict mode)
- Ensure `eslint.ignoreDuringBuilds: false` (but allow warnings)
- Fix all TypeScript errors before pushing

## ✅ Recommended Vercel Configuration

### Project Settings

**Root Directory**: `frontend`

**Build & Development Settings**:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or leave empty for auto-detection)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (or leave empty for auto-detection)

**Node.js Version**: `20.x` (as specified in `package.json` engines)

### Environment Variables

**Required for Production**:
```
NEXT_PUBLIC_API_URL=https://api.scorenews.net
NEXT_PUBLIC_WS_URL=wss://api.scorenews.net
```

**Optional**:
```
NEXT_PUBLIC_SITE_URL=https://scorenews.net
```

## 🔧 Quick Fixes

### Fix 1: Update next.config.mjs
Already done - `turbopack.root` is set.

### Fix 2: Update vercel.json
Update build command if needed:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Fix 3: Set Root Directory in Vercel
1. Go to Vercel Dashboard
2. Project Settings → General
3. Set **Root Directory** to `frontend`

### Fix 4: Check Build Logs
In Vercel Dashboard, check the build logs for specific errors:
1. Go to Deployments
2. Click on failed deployment
3. View Build Logs
4. Look for specific error messages

## 🚨 Troubleshooting Steps

1. **Check Build Logs**: Look for specific error in Vercel dashboard
2. **Verify Root Directory**: Ensure set to `frontend` in Vercel settings
3. **Check Environment Variables**: Ensure all required vars are set
4. **Test Build Locally**: Run `npm run build` to catch issues early
5. **Check Node Version**: Ensure Vercel uses Node 20.x
6. **Clear Cache**: Try clearing Vercel build cache and redeploying

## 📝 Next Steps

1. ✅ Fixed `turbopack.root` in `next.config.mjs`
2. ⏳ Verify Root Directory is set to `frontend` in Vercel
3. ⏳ Ensure all environment variables are set
4. ⏳ Test build in Vercel dashboard

---

**Status**: Configuration updated, verify Vercel project settings

