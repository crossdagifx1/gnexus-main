# 🚀 GitHub Repository Setup Guide

Follow these steps to set up your GitHub repository and activate the CI/CD pipeline.

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com and sign in
2. Click the **+** icon in the top-right → **New repository**
3. Fill in the details:
   - **Repository name**: `gnexus-main` (or your preferred name)
   - **Description**: "G-Nexus - Ethiopia's Digital Core"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if you don't have it
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create gnexus-main --public --description "G-Nexus - Ethiopia's Digital Core"
```

## Step 2: Rename Master to Main (Recommended)

GitHub prefers `main` as the default branch name:

```bash
cd c:\Users\CROSS\Desktop\gnexus-main
git branch -m master main
```

## Step 3: Add GitHub Remote

Copy the remote URL from your newly created repository, then:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/gnexus-main.git

# Or using SSH (if you have SSH keys set up):
git remote add origin git@github.com:YOUR-USERNAME/gnexus-main.git

# Verify the remote was added
git remote -v
```

## Step 4: Push Code to GitHub

```bash
# Push main branch
git push -u origin main

# Push develop branch
git push -u origin develop
```

After pushing, your code will be on GitHub but deployments won't work yet (missing secrets).

## Step 5: Configure GitHub Secrets

GitHub Actions needs your FTP credentials to deploy.

### Add Secrets via Web Interface

1. Go to your repository on GitHub
2. Click **Settings** (repository settings, not your account)
3. In the left sidebar, navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each of the following secrets:

#### Required Secrets

| Secret Name | Value | Notes |
|------------|-------|-------|
| `FTP_SERVER` | `ftp.gnexuset.com` | Your FTP hostname |
| `FTP_USERNAME` | `gnex@gnexuset.com` | Your FTP username |
| `FTP_PASSWORD` | `dAgi143100` | Your FTP password |

**Security Note**: Never commit these credentials to your repository. They are encrypted and only accessible to GitHub Actions.

Add each secret:
1. Click **New repository secret**
2. Enter **Name** (e.g., `FTP_SERVER`)
3. Enter **Value** (e.g., `ftp.gnexuset.com`)
4. Click **Add secret**
5. Repeat for all three secrets

### Alternative: Add Secrets via GitHub CLI

```bash
gh secret set FTP_SERVER --body "ftp.gnexuset.com"
gh secret set FTP_USERNAME --body "gnex@gnexuset.com"
gh secret set FTP_PASSWORD --body "dAgi143100"
```

## Step 6: Set Up Environments (Optional but Recommended)

Environments provide additional protection and approval workflows.

1. Go to repository **Settings** → **Environments**
2. Click **New environment**
3. Create two environments:

### Production Environment

- **Name**: `production`
- **Deployment branches**: Limit to `main` branch only
- **Environment secrets**: (optional) can override repository secrets if needed
- Click **Configure environment** → **Save protection rules**

### Test Environment

- **Name**: `test`
- **Deployment branches**: Limit to `develop` branch only
- Click **Configure environment** → **Save protection rules**

## Step 7: Configure Branch Protection (Recommended)

Protect important branches from accidental changes:

### Protect Main Branch

1. Go to repository **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Enter branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (at least 1)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
5. Click **Create**

### Protect Develop Branch

Repeat the above for `develop` branch with these settings:
- ✅ Require status checks to pass before merging
- (Optional) Require pull request reviews

## Step 8: Test the Deployment

Now that everything is set up, let's test!

### Test Deployment to Test Environment

1. Make a small change in the `develop` branch:
   ```bash
   git checkout develop
   echo "# Test Deployment" >> README.md
   git add README.md
   git commit -m "test: verify CI/CD deployment"
   git push origin develop
   ```

2. Go to GitHub → **Actions** tab
3. You should see the workflow "Deploy to Test (gnexuset.com/test)" running
4. Monitor the workflow progress
5. Once complete, visit **https://gnexuset.com/test** to verify

### Test Deployment to Production

1. Merge develop into main:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. Go to GitHub → **Actions** tab
3. You should see "Deploy to Production (gnexuset.com)" running
4. Once complete, visit **https://gnexuset.com** to verify

## Step 9: Update Supabase Environment Variables

Update your environment files with real Supabase credentials:

### Edit `.env.production`

```bash
# Open in your editor
code .env.production
```

Replace placeholders with your actual Supabase credentials:
```env
VITE_SUPABASE_PROJECT_ID="your-actual-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-actual-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENABLED=true
```

### Edit `.env.test`

Do the same for `.env.test` (can use same Supabase project or a separate test project).

### Commit and Deploy

```bash
git add .env.production .env.test
git commit -m "chore: update environment variables"
git push origin main
```

## Troubleshooting

### "Repository not found" Error

Make sure you're using the correct repository URL and have the right permissions.

```bash
# Check remote URL
git remote -v

# If incorrect, update it
git remote set-url origin https://github.com/YOUR-USERNAME/gnexus-main.git
```

### Workflow Not Triggering

- Check that secrets are added correctly (Settings → Secrets)
- Verify workflow files exist in `.github/workflows/`
- Check workflow triggers in the YAML files
- Look at the **Actions** tab for error messages

### FTP Deployment Failing

Common causes:
- Incorrect FTP credentials → Verify secrets
- FTP server firewall blocking GitHub Actions IPs
- Incorrect server directory paths in workflow files
- FTP port blocked (ensure port 21 is accessible)

To debug:
1. Check workflow logs in GitHub Actions
2. Look for FTP connection errors
3. Verify credentials by testing with an FTP client

### Assets Not Loading After Deployment

Check that `.htaccess` file was deployed:
- Ensure it's in the `public/` directory before build
- Vite should copy it to `dist/` during build
- FTP should upload it to cPanel

## Next Steps

Now that GitHub is set up:

1. ✅ **Read** `DEPLOYMENT.md` for deployment procedures
2. ✅ **Read** `CONTRIBUTING.md` for development workflow
3. ✅ **Invite** team members to the repository
4. ✅ **Configure** branch protection rules
5. ✅ **Test** a full deployment cycle
6. ✅ **Monitor** GitHub Actions for successful builds

## GitHub Repository Structure

```
gnexus-main/
├── .github/
│   └── workflows/
│       ├── deploy-production.yml  # Production deployment
│       ├── deploy-test.yml       # Test deployment
│       └── ci.yml                # Quality checks
├── src/                          # Application source code
├── public/                       # Static assets
├── .env.production              # Production environment vars
├── .env.test                    # Test environment vars
├── DEPLOYMENT.md                # Deployment documentation
├── CONTRIBUTING.md              # Contribution guidelines
└── README.md                    # Project overview
```

## Support

If you encounter any issues:

1. **Check GitHub Actions logs** for detailed error messages
2. **Review documentation** in `DEPLOYMENT.md`
3. **Search GitHub Issues** for similar problems
4. **Create a new issue** with error details and logs

---

**Congratulations!** 🎉 Your GitHub CI/CD pipeline is now set up!

Every push to `develop` will deploy to test, and every push to `main` will deploy to production.
