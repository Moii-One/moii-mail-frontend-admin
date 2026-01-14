# Frontend Packages Deployment Guide

## Overview
All frontend packages have been initialized as git repositories and are ready to be pushed to GitHub with the naming convention: `moii-*-frontend-admin`

## Setup Complete ✅

1. **Git Initialization**: All 16 packages initialized with git
2. **Gitignore**: Admin `.gitignore` updated to exclude `/packages`
3. **Initial Commits**: All packages have initial commits on `main` branch
4. **Deployment Script**: Automated script created for GitHub deployment

## Packages Ready for Deployment

1. moii-apps-frontend-admin
2. moii-auth-frontend-admin
3. moii-cache-frontend-admin
4. moii-categories-frontend-admin
5. moii-example-frontend-admin
6. moii-limiter-frontend-admin
7. moii-localizations-frontend-admin
8. moii-logs-frontend-admin
9. moii-media-frontend-admin
10. moii-notifications-frontend-admin
11. moii-reviews-frontend-admin
12. moii-scheduler-frontend-admin
13. moii-settings-frontend-admin
14. moii-tenants-frontend-admin
15. moii-user-settings-frontend-admin
16. moii-users-frontend-admin

## Deployment Instructions

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "b2go-packages-deployment"
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't see it again)

### Step 2: Run Deployment Script

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin
export GITHUB_TOKEN="your_token_here"
./deploy-packages.sh
```

Or run it interactively (it will prompt for token):

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin
./deploy-packages.sh
```

The script will:
1. ✅ Create all 16 private repositories under Moii-One organization
2. ✅ Add remote URLs to each package
3. ✅ Push all code to GitHub

### Alternative: Manual Deployment (If Script Fails)

If the automated script encounters issues, use the manual script:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin
./push-packages.sh
```

This will:
1. Show you all repository URLs to create manually on GitHub
2. Wait for you to create them
3. Add remotes and push

## Package Structure

Each package is now an independent git repository:
```
admin/
├── packages/
│   ├── moii-apps/.git         ← Independent repo
│   ├── moii-auth/.git         ← Independent repo
│   ├── moii-cache/.git        ← Independent repo
│   └── ...
```

This mirrors the backend structure in `api/packages/`

## Development Workflow

### Making Changes to a Package

```bash
cd admin/packages/moii-users
git add .
git commit -m "Update user management"
git push origin main
```

### Updating All Packages at Once

Create a script to iterate through packages:

```bash
#!/bin/bash
for package in admin/packages/*/; do
  cd "$package"
  if [ -n "$(git status --porcelain)" ]; then
    echo "Updating $(basename $package)..."
    git add .
    git commit -m "Update package"
    git push origin main
  fi
  cd -
done
```

### Pulling Latest Changes

```bash
cd admin/packages/moii-users
git pull origin main
```

## Important Notes

1. **Main Admin Repo**: The main `admin` repo now has `/packages` in `.gitignore`, so package changes won't be tracked there
2. **Separate Backups**: Each package is backed up independently to GitHub
3. **Local Development**: You continue developing in the same location - nothing changes in your workflow
4. **No Submodules**: Unlike typical multi-repo setups, these are NOT git submodules - they're independent repos living in the packages folder

## Verification

After deployment, verify at:
- https://github.com/Moii-One?tab=repositories

You should see all 16 `*-frontend-admin` repositories as private repos.

## Troubleshooting

### Authentication Failed
- Verify your token has `repo` scope
- Make sure token is not expired
- Try regenerating the token

### Repository Already Exists
- Script will detect and skip creation
- Will attempt to push to existing repo

### Push Rejected
- May need to force push first time: `git push -f origin main`
- Check if you have write access to Moii-One organization

## Scripts Available

- `deploy-packages.sh` - Automated creation and push (recommended)
- `push-packages.sh` - Manual repo creation, automated push
- `setup-packages.sh` - Original initialization script (already run)

## Next Steps

After successful deployment:
1. ✅ Verify all repos are on GitHub
2. ✅ Test pulling changes from a package
3. ✅ Test pushing changes to a package
4. Consider setting up branch protection rules on GitHub
5. Consider adding CI/CD workflows for each package
