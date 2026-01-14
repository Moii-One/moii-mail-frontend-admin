#!/bin/bash

# Script to initialize frontend packages as git repositories and push to GitHub
# Naming convention: moii-*-frontend-admin

GITHUB_ORG="Moii-One"
PACKAGES_DIR="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

echo -e "${BLUE}Starting package initialization and push to GitHub...${NC}\n"

for PACKAGE in "${PACKAGES[@]}"; do
  PACKAGE_PATH="$PACKAGES_DIR/$PACKAGE"
  REPO_NAME="${PACKAGE}-frontend-admin"
  
  echo -e "${GREEN}Processing: $PACKAGE -> $REPO_NAME${NC}"
  
  # Check if package directory exists
  if [ ! -d "$PACKAGE_PATH" ]; then
    echo -e "${RED}  ✗ Package directory not found: $PACKAGE_PATH${NC}"
    continue
  fi
  
  cd "$PACKAGE_PATH"
  
  # Check if already a git repository
  if [ -d ".git" ]; then
    echo "  • Already a git repository, checking remote..."
    
    # Check if remote exists
    if git remote | grep -q "^origin$"; then
      CURRENT_REMOTE=$(git remote get-url origin)
      echo "  • Remote already exists: $CURRENT_REMOTE"
      
      # Check if there are uncommitted changes
      if [ -n "$(git status --porcelain)" ]; then
        echo "  • Staging and committing changes..."
        git add .
        git commit -m "Update package code"
      else
        echo "  • No changes to commit"
      fi
      
      # Push to remote
      echo "  • Pushing to remote..."
      git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || {
        echo -e "${RED}  ✗ Failed to push (branch may not exist on remote)${NC}"
        echo "  • Creating main branch and pushing..."
        git branch -M main
        git push -u origin main
      }
    else
      echo "  • No remote configured"
      echo "  • Creating GitHub repository: $REPO_NAME..."
      
      # Create private repo using GitHub CLI
      gh repo create "$GITHUB_ORG/$REPO_NAME" --private --source=. --remote=origin --push 2>/dev/null || {
        echo -e "${RED}  ✗ GitHub CLI not available or failed${NC}"
        echo "  • Please create repo manually at: https://github.com/$GITHUB_ORG/$REPO_NAME"
        echo "  • Then run: git remote add origin git@github.com:$GITHUB_ORG/$REPO_NAME.git"
        echo "  • And push: git push -u origin main"
      }
    fi
  else
    echo "  • Initializing git repository..."
    git init
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
      echo "  • Creating .gitignore..."
      cat > .gitignore << 'EOL'
/dist
/node_modules
.DS_Store
*.log
.env
.env.local
EOL
    fi
    
    # Initial commit
    echo "  • Creating initial commit..."
    git add .
    git commit -m "Initial commit: $PACKAGE frontend admin package"
    
    # Rename to main branch
    git branch -M main
    
    # Create GitHub repository
    echo "  • Creating GitHub repository: $REPO_NAME..."
    gh repo create "$GITHUB_ORG/$REPO_NAME" --private --source=. --remote=origin --push 2>/dev/null || {
      echo -e "${RED}  ✗ GitHub CLI not available or failed${NC}"
      echo "  • Please create repo manually at: https://github.com/$GITHUB_ORG/$REPO_NAME"
      echo "  • Then run: git remote add origin git@github.com:$GITHUB_ORG/$REPO_NAME.git"
      echo "  • And push: git push -u origin main"
    }
  fi
  
  echo -e "${GREEN}  ✓ Completed: $PACKAGE${NC}\n"
done

echo -e "${BLUE}Package initialization complete!${NC}"
echo -e "${BLUE}All packages are now backed up to GitHub.${NC}"
