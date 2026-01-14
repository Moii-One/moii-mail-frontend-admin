#!/bin/bash

# Quick deployment command - paste your GitHub token when prompted

echo "================================================"
echo "Frontend Packages GitHub Deployment"
echo "================================================"
echo ""
echo "This will:"
echo "  1. Create 16 private repositories on GitHub"
echo "  2. Push all package code to GitHub"
echo ""
echo "Repository naming: moii-*-frontend-admin"
echo "Organization: Moii-One"
echo ""
echo "================================================"
echo ""
echo "You need a GitHub Personal Access Token with 'repo' scope"
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

cd /Applications/XAMPP/xamppfiles/htdocs/b2go/admin/scripts
./deploy-packages.sh
