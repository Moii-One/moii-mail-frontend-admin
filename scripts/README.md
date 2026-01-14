# Package Management Scripts

This folder contains scripts for managing frontend packages and their GitHub repositories.

## Quick Commands

### Deploy All Packages to GitHub (First Time)
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin/scripts
./DEPLOY_NOW.sh
```

### Update All Packages (After Changes)
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin/scripts
./update-all-packages.sh "Your commit message"
```

## Available Scripts

- **`DEPLOY_NOW.sh`** - Interactive deployment wizard
- **`deploy-packages.sh`** - Automated GitHub repo creation and push
- **`update-all-packages.sh`** - Commit and push all changed packages
- **`setup-packages.sh`** - Initialize packages as git repos (already done)
- **`push-packages.sh`** - Push packages (manual repo creation)
- **`auto-push-packages.sh`** - Alternative deployment method

## Documentation

See `PACKAGES_DEPLOYMENT.md` for complete documentation.
