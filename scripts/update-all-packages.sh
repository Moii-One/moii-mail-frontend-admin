#!/bin/bash

# Helper script to commit and push all packages with changes

PACKAGES_DIR="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Checking for changes in all packages...${NC}\n"

COMMIT_MSG="${1:-Update packages}"

UPDATED=0
SKIPPED=0

for package_path in "$PACKAGES_DIR"/*; do
  if [ -d "$package_path/.git" ]; then
    PACKAGE=$(basename "$package_path")
    cd "$package_path"
    
    if [ -n "$(git status --porcelain)" ]; then
      echo -e "${YELLOW}● $PACKAGE${NC} - Changes detected"
      git add .
      git commit -m "$COMMIT_MSG"
      git push origin main
      echo -e "${GREEN}  ✓ Committed and pushed${NC}\n"
      ((UPDATED++))
    else
      echo -e "${GREEN}✓ $PACKAGE${NC} - No changes"
      ((SKIPPED++))
    fi
  fi
done

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Summary${NC}"
echo -e "  Updated:  $UPDATED"
echo -e "  Skipped:  $SKIPPED"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
