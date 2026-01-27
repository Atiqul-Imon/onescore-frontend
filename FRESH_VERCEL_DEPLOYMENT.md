# 🚀 Fresh Vercel Deployment Guide

## Step-by-Step Instructions for Clean Deployment

### Option 1: Fresh Deployment via Vercel Dashboard (Recommended)

#### Step 1: Clean Up Current Project (if exists)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. If you have an existing project:
   - Go to **Settings** → **General**
   - Scroll down and click **Delete Project**
   - Confirm deletion
   - OR keep the project and skip to Step 2

#### Step 2: Create New Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub account
4. Find and select: `Atiqul-Imon/onescore-frontend`
5. Click **Import**

#### Step 3: Configure Project Settings

**IMPORTANT**: Configure these BEFORE clicking Deploy!

1. **Project Name**: `onescore-frontend` (or your preferred name)

2. **Root Directory**: 
   - Click **Edit** next to "Root Directory"
   - Enter: `frontend`
   - **This is CRITICAL!**

3. **Framework Preset**: 
   - Should auto-detect as **Next.js**
   - If not, select **Next.js** manually

4. **Build and Output Settings** (Leave as default/empty):
   - **Build Command**: Leave empty (auto-detects `npm run build`)
   - **Output Directory**: Leave empty (auto-detects `.next`)
   - **Install Command**: Leave empty (auto-detects `npm install`)

5. **Environment Variables**:
   Click **Add** and add these variables:

   For **Production, Preview, and Development**:
   ```
   NEXT_PUBLIC_API_URL=https://api.scorenews.net
   ```
   ```
   NEXT_PUBLIC_WS_URL=wss://api.scorenews.net
   ```

   **Important**: 
   - Check all three environments (Production, Preview, Development)
   - Use `wss://` (secure WebSocket) for production
   - For Development, you might want `http://localhost:5000` and `ws://localhost:5000`

6. **Node.js Version**: Select **20.x** (matches your `package.json` engines)

#### Step 4: Deploy

1. Review all settings
2. Click **Deploy**
3. Wait for build to complete (usually 2-5 minutes)
4. Once successful, your site will be live!

---

### Option 2: Fresh Deployment via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Navigate to Frontend Directory

```bash
cd /home/atiqul-islam/Cricinfo-main/frontend
```

#### Step 4: Remove Old Vercel Configuration

```bash
rm -rf .vercel
```

#### Step 5: Link/Deploy Fresh

```bash
# This will prompt you to create a new project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No (for fresh deployment)
# - What's your project's name? onescore-frontend
# - In which directory is your code located? ./
# - Want to override the settings? No
```

#### Step 6: Configure Environment Variables

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://api.scorenews.net

vercel env add NEXT_PUBLIC_WS_URL production
# Enter: wss://api.scorenews.net

vercel env add NEXT_PUBLIC_API_URL preview
# Enter: https://api.scorenews.net

vercel env add NEXT_PUBLIC_WS_URL preview
# Enter: wss://api.scorenews.net
```

#### Step 7: Deploy to Production

```bash
vercel --prod
```

---

### Option 3: Fresh Deployment via GitHub (Recommended for CI/CD)

If your repository is already connected to Vercel:

#### Step 1: Clean Local Build Artifacts

```bash
cd /home/atiqul-islam/Cricinfo-main/frontend
rm -rf .next .vercel node_modules/.cache
```

#### Step 2: Commit Clean State

```bash
git add .
git commit -m "chore: prepare for fresh Vercel deployment"
git push origin developer
```

#### Step 3: Configure in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. **Set Root Directory to: `frontend`** (MOST IMPORTANT!)
5. Verify environment variables are set
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment
8. Or wait for automatic deployment from GitHub push

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Verify site is accessible at your Vercel URL
- [ ] Test API connections (check browser console)
- [ ] Test WebSocket connections
- [ ] Verify all pages load correctly
- [ ] Check environment variables are working
- [ ] Test on mobile device
- [ ] Verify security headers are applied

---

## 🔍 Troubleshooting Fresh Deployment

### Issue: "Root Directory not found"
**Solution**: Make sure Root Directory is set to `frontend` in Vercel settings

### Issue: "Build failed"
**Solution**: 
1. Check build logs in Vercel dashboard
2. Verify Node.js version is 20.x
3. Ensure all dependencies are in `package.json`

### Issue: "Environment variables not working"
**Solution**: 
1. Redeploy after adding environment variables
2. Ensure variables start with `NEXT_PUBLIC_` for client-side access
3. Clear browser cache and test again

### Issue: "404 errors on routes"
**Solution**: 
1. Verify `next.config.mjs` is correct
2. Check if routes are properly configured
3. Ensure build completed successfully

---

## 📝 Current Configuration

- **Framework**: Next.js 16.1.3
- **Node Version**: 20.x
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **vercel.json**: Minimal configuration (auto-detection preferred)

---

## 🎯 Recommended Approach

For the cleanest fresh deployment, use **Option 1 (Vercel Dashboard)**:

1. Create a new project in Vercel
2. Import from GitHub
3. **Set Root Directory to `frontend`** ⚠️ CRITICAL
4. Add environment variables
5. Deploy

This ensures a completely fresh start with all correct settings from the beginning.


