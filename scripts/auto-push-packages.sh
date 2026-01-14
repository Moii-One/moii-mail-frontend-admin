#!/bin/bash

# Automated script to create GitHub repositories and push packages
# Uses GitHub API with personal access token

GITHUB_ORG="Moii-One"
PACKAGES_DIR="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}Please enter your GitHub Personal Access Token:${NC}"
  echo -e "${YELLOW}(Create one at: https://github.com/settings/tokens with 'repo' scope)${NC}"
  read -s GITHUB_TOKEN
  echo ""
fi

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

echo -e "${BLUE}Starting automated repository creation and push...${NC}\n"

for PACKAGE in "${PACKAGES[@]}"; do
  PACKAGE_PATH="$PACKAGES_DIR/$PACKAGE"
  REPO_NAME="${PACKAGE}-frontend-admin"
  
  echo -e "${GREEN}Processing: $PACKAGE -> $REPO_NAME${NC}"
  
  if [ ! -d "$PACKAGE_PATH" ]; then
    echo -e "${RED}  ✗ Package directory not found: $PACKAGE_PATH${NC}"
    continue
  fi
  
  # Create repository on GitHub using API
  echo "  • Creating repository on GitHub..."
  CREATE_RESPONSE=$(curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/orgs/$GITHUB_ORG/repos" \
    -d "{\"name\":\"$REPO_NAME\",\"private\":true,\"auto_init\":false}")
  
  if echo "$CREATE_RESPONSE" | grep -q "\"id\""; then
    echo -e "${GREEN}  ✓ Repository created successfully${NC}"
  elif echo "$CREATE_RESPONSE" | grep -q "name already exists"; then
    echo -e "${YELLOW}  • Repository already exists${NC}"
  else
    echo -e "${RED}  ✗ Failed to create repository${NC}"
    echo "$CREATE_RESPONSE" | head -n 5
    continue
  fi
  
  cd "$PACKAGE_PATH"
  
  # Check if remote exists
  if git remote | grep -q "^origin$"; then
    echo "  • Remote already configured"
  else
    echo "  • Adding remote origin..."
    git remote add origin "git@github.com:$GITHUB_ORG/$REPO_NAME.git"
  fi
  
  # Push to remote
  echo "  • Pushing to GitHub..."
  if git push -u origin main 2>&1 | grep -q "main -> main"; then
    echo -e "${GREEN}  ✓ Successfully pushed $PACKAGE${NC}"
  elif git push -u origin main 2>&1; then
    echo -e "${GREEN}  ✓ Pushed $PACKAGE${NC}"
  else
    echo -e "${RED}  ✗ Failed to push $PACKAGE${NC}"
  fi
  
  echo ""
done

echo -e "${BLUE}Automation complete!${NC}"
echo -e "${BLUE}All packages have been created and pushed to GitHub.${NC}"
