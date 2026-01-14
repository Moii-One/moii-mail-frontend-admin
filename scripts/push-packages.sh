#!/bin/bash

# Script to add remotes and push packages to GitHub
# NOTE: You must create these repositories manually on GitHub first at:
# https://github.com/Moii-One

GITHUB_ORG="Moii-One"
PACKAGES_DIR="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Array of packages to process
PACKAGES=(
  "moii-apps"
  "moii-auth"
  "moii-cache"
  "moii-categories"
  "moii-example"
  "moii-limiter"
  "moii-localizations"
  "moii-logs"
  "moii-media"
  "moii-notifications"
  "moii-reviews"
  "moii-scheduler"
  "moii-settings"
  "moii-tenants"
  "moii-user-settings"
  "moii-users"
)

echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}IMPORTANT: Create these repositories on GitHub first:${NC}"
echo -e "${YELLOW}================================================${NC}"
for PACKAGE in "${PACKAGES[@]}"; do
  REPO_NAME="${PACKAGE}-frontend-admin"
  echo -e "${YELLOW}https://github.com/$GITHUB_ORG/$REPO_NAME${NC}"
done
echo -e "${YELLOW}================================================${NC}"
echo ""
echo -e "${BLUE}Press Enter when all repositories are created on GitHub...${NC}"
read

echo -e "${BLUE}Starting to add remotes and push packages...${NC}\n"

for PACKAGE in "${PACKAGES[@]}"; do
  PACKAGE_PATH="$PACKAGES_DIR/$PACKAGE"
  REPO_NAME="${PACKAGE}-frontend-admin"
  
  echo -e "${GREEN}Processing: $PACKAGE -> $REPO_NAME${NC}"
  
  if [ ! -d "$PACKAGE_PATH" ]; then
    echo -e "${RED}  ✗ Package directory not found: $PACKAGE_PATH${NC}"
    continue
  fi
  
  cd "$PACKAGE_PATH"
  
  # Check if remote exists
  if git remote | grep -q "^origin$"; then
    echo "  • Remote already exists"
  else
    echo "  • Adding remote origin..."
    git remote add origin "git@github.com:$GITHUB_ORG/$REPO_NAME.git"
  fi
  
  # Push to remote
  echo "  • Pushing to GitHub..."
  if git push -u origin main 2>&1; then
    echo -e "${GREEN}  ✓ Successfully pushed $PACKAGE${NC}"
  else
    echo -e "${RED}  ✗ Failed to push $PACKAGE${NC}"
    echo -e "${RED}  Please check if repository exists at: https://github.com/$GITHUB_ORG/$REPO_NAME${NC}"
  fi
  
  echo ""
done

echo -e "${BLUE}Push complete!${NC}"
echo -e "${BLUE}All packages have been pushed to GitHub.${NC}"
