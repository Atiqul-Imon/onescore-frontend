# 🔀 How to Merge Developer → Main Branch

## Current Situation

- ✅ **Local merge completed**: developer → main (commit `213d0dc`)
- ❌ **GitHub branch protection**: Requires Pull Request to merge to main
- 📋 **Next step**: Create Pull Request on GitHub

## Step-by-Step Instructions

### Step 1: Create Pull Request

1. Go to your repository on GitHub:
   ```
   https://github.com/Atiqul-Imon/onescore-frontend
   ```

2. Click **"Pull requests"** tab

3. Click **"New pull request"**

4. Set the branches:
   - **Base branch**: `main` (where you want to merge into)
   - **Compare branch**: `developer` (what you want to merge)

5. GitHub will show you a link like:
   ```
   https://github.com/Atiqul-Imon/onescore-frontend/compare/main...developer
   ```

6. Review the changes (should show all commits from developer)

7. Add a title:
   ```
   Merge developer to main for production deployment
   ```

8. Add a description (optional):
   ```
   This merge includes:
   - Updated Next.js to v16
   - Fixed Vercel deployment configuration
   - Prepared for fresh Vercel deployment
   - All latest changes from developer branch
   ```

9. Click **"Create pull request"**

### Step 2: Merge the Pull Request

1. Review the PR (check files changed, commits, etc.)

2. Click **"Merge pull request"** button

3. Choose merge type:
   - **Create a merge commit** (recommended, preserves history)
   - Or **Squash and merge** (combines all commits into one)
   - Or **Rebase and merge** (linear history)

4. Click **"Confirm merge"**

5. Optionally delete the developer branch after merge (usually keep it)

### Step 3: Verify

1. Check that main branch on GitHub is updated
2. Check that your local main is in sync:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Switch back to developer:
   ```bash
   git checkout developer
   ```

## Alternative: Quick PR Link

You can create the PR directly via this URL:

```
https://github.com/Atiqul-Imon/onescore-frontend/compare/main...developer?quick_pull=1&title=Merge%20developer%20to%20main%20for%20production%20deployment
```

## What Gets Merged

The PR will merge these commits from developer:
- ✅ chore: prepare vercel.json for fresh deployment
- ✅ Troubleshoot vercel deployemnt
- ✅ improve vercel.json
- ✅ Fix vercel.json
- ✅ Fix vercel config
- ✅ Upgrade nextjs version
- Plus all other commits from developer that aren't in main

## After Merging

Once the PR is merged:

1. ✅ **Main branch on GitHub will be updated**
2. ✅ **Vercel will detect the push** (if auto-deploy is enabled)
3. ✅ **Or trigger a fresh deployment** in Vercel dashboard

## Troubleshooting

### PR shows conflicts
- Usually means main has changes not in developer
- GitHub will show conflict resolution UI
- Or merge main into developer first:
  ```bash
  git checkout developer
  git merge main
  # Resolve conflicts
  git push origin developer
  ```

### Can't create PR
- Make sure developer branch is pushed to GitHub
- Run: `git push origin developer`

### Main is already merged locally
- The local merge will be ignored when PR is merged
- GitHub will create its own merge commit
- This is fine - both represent the same change

## Summary

Since GitHub requires Pull Requests for main branch:

1. ✅ Developer branch is already pushed
2. 📋 **Create PR**: developer → main on GitHub
3. ✅ **Merge PR** via GitHub UI
4. ✅ Main branch will be updated on GitHub
5. ✅ Vercel deployment will trigger

---

**Quick Action**: 
Visit: https://github.com/Atiqul-Imon/onescore-frontend/compare/main...developer

