#!/bin/bash

# Final automated script - creates repos and pushes using HTTPS
# You'll need a GitHub Personal Access Token

GITHUB_ORG="Moii-One"
PACKAGES_DIR="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get GitHub token from environment or prompt
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}GitHub Personal Access Token Required${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Create one at: https://github.com/settings/tokens${NC}"
  echo -e "${YELLOW}Required scopes: repo (Full control of private repositories)${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}Enter your GitHub token:${NC}"
  read -s GITHUB_TOKEN
  echo ""
  
  if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: Token is required${NC}"
    exit 1
  fi
fi

# Packages array
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

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Starting Package Deployment to GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

SUCCESSFUL=0
FAILED=0

for PACKAGE in "${PACKAGES[@]}"; do
  PACKAGE_PATH="$PACKAGES_DIR/$PACKAGE"
  REPO_NAME="${PACKAGE}-frontend-admin"
  
  echo -e "${BLUE}[$((SUCCESSFUL + FAILED + 1))/${#PACKAGES[@]}] ${GREEN}$REPO_NAME${NC}"
  
  if [ ! -d "$PACKAGE_PATH" ]; then
    echo -e "  ${RED}✗ Package directory not found${NC}\n"
    ((FAILED++))
    continue
  fi
  
  cd "$PACKAGE_PATH"
  
  # Step 1: Create repository on GitHub
  echo -e "  ${BLUE}→${NC} Creating repository..."
  CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/orgs/$GITHUB_ORG/repos" \
    -d "{\"name\":\"$REPO_NAME\",\"private\":true,\"auto_init\":false,\"description\":\"Frontend admin package for $PACKAGE\"}")
  
  HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
  RESPONSE_BODY=$(echo "$CREATE_RESPONSE" | sed '$d')
  
  if [ "$HTTP_CODE" = "201" ]; then
    echo -e "  ${GREEN}✓${NC} Repository created"
  elif [ "$HTTP_CODE" = "422" ] && echo "$RESPONSE_BODY" | grep -q "name already exists"; then
    echo -e "  ${YELLOW}○${NC} Repository already exists"
  else
    echo -e "  ${RED}✗${NC} Failed to create repository (HTTP $HTTP_CODE)"
    echo "$RESPONSE_BODY" | grep -o '"message":"[^"]*"' | head -n1
    ((FAILED++))
    echo ""
    continue
  fi
  
  # Step 2: Configure remote
  if git remote | grep -q "^origin$"; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [[ "$CURRENT_REMOTE" != *"$REPO_NAME"* ]]; then
      echo -e "  ${BLUE}→${NC} Updating remote..."
      git remote set-url origin "https://$GITHUB_TOKEN@github.com/$GITHUB_ORG/$REPO_NAME.git"
    fi
  else
    echo -e "  ${BLUE}→${NC} Adding remote..."
    git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_ORG/$REPO_NAME.git"
  fi
  
  # Step 3: Push to GitHub
  echo -e "  ${BLUE}→${NC} Pushing to GitHub..."
  PUSH_OUTPUT=$(git push -u origin main 2>&1)
  
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} Successfully pushed"
    ((SUCCESSFUL++))
  else
    echo -e "  ${RED}✗${NC} Failed to push"
    echo "$PUSH_OUTPUT" | grep -i "error\|fatal\|rejected" | head -n2
    ((FAILED++))
  fi
  
  echo ""
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Deployment Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}Successful:${NC} $SUCCESSFUL"
echo -e "  ${RED}Failed:${NC}     $FAILED"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $SUCCESSFUL -gt 0 ]; then
  echo -e "\n${GREEN}View your repositories at:${NC}"
  echo -e "${BLUE}https://github.com/$GITHUB_ORG?tab=repositories${NC}"
fi

exit $FAILED
