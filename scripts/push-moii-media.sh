#!/bin/bash

# Push moii-media package changes to GitHub

PACKAGE_NAME="moii-media"
PACKAGE_PATH="/Applications/XAMPP/xamppfiles/htdocs/b2go/admin/packages/$PACKAGE_NAME"
COMMIT_MESSAGE="Add MediaPickerModal component with composable, fix checkbox styling, and grid layout

- Created MediaPickerModal.vue with full media library features
- Added useMediaPicker composable for async/await usage
- Fixed store issues (added media alias for backwards compatibility)
- Fixed table view display
- Addressed checkbox selection reactivity
- Improved checkbox styling for light/dark modes
- Adjusted grid layout to show 8-10 columns
- Fixed z-index issues with inline styles
- Added comprehensive documentation"

echo "=================================================="
echo "Pushing $PACKAGE_NAME package to GitHub"
echo "=================================================="

cd "$PACKAGE_PATH" || exit 1

# Stage all changes
echo "📦 Staging changes in $PACKAGE_NAME..."
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "✓ $PACKAGE_NAME - No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes in $PACKAGE_NAME..."
    git commit -m "$COMMIT_MESSAGE"
    
    # Push to remote
    echo "🚀 Pushing $PACKAGE_NAME to GitHub..."
    if git push origin main; then
        echo "✅ Successfully pushed $PACKAGE_NAME"
    else
        echo "❌ Failed to push $PACKAGE_NAME"
        exit 1
    fi
fi

echo "=================================================="
echo "Done!"
echo "=================================================="
