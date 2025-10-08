# Feature Flags Package Summary

## Overview

The Feature Flags functionality is part of the moii-settings package and provides a user-friendly interface for managing feature flags dynamically without code deployments.

## Features

- ✅ **Toggle Features**: Simple on/off switches for each feature
- ✅ **Search & Filter**: Search by feature name/key and filter by status
- ✅ **Add New Features**: Create new feature flags with descriptions
- ✅ **Statistics Dashboard**: Overview of total, enabled, and disabled features
- ✅ **Real-time Updates**: Immediate UI updates when toggling features
- ✅ **Authentication**: Protected routes requiring admin access

## Components

### FeatureFlagsStore (`stores/featureFlags.ts`)
Pinia store for managing feature flag state:

**State:**
- `features`: Record of feature keys and their enabled/disabled status
- `loading`: Loading state for API operations
- `error`: Error messages

**Getters:**
- `featuresList`: Array of feature objects with formatted names
- `enabledFeatures`: Array of currently enabled features
- `disabledFeatures`: Array of currently disabled features

**Actions:**
- `fetchFeatures()`: Load all feature flags from API
- `enableFeature(name)`: Enable a specific feature
- `disableFeature(name)`: Disable a specific feature
- `toggleFeature(name, enabled)`: Toggle feature on/off
- `isEnabled(name)`: Check if feature is enabled

### FeatureFlagsHeader Component
Header with search, filter, and add new feature functionality.

### FeatureFlagModal Component
Modal for adding new features or editing existing ones with:
- Feature name input (automatically prefixed with 'feature.')
- Description textarea
- Enable/disable checkbox

### FeatureFlagsList View
Main view displaying:
- Table of all features with toggle switches
- Statistics cards showing totals
- Search and filtering capabilities

## API Integration

Uses the existing moii-settings API endpoints:
- `GET /api/settings/features/all` - Get all feature flags
- `POST /api/settings/features/{feature}/enable` - Enable feature
- `POST /api/settings/features/{feature}/disable` - Disable feature

## Navigation

Added to admin sidebar under Settings dropdown:
- Settings → System Settings
- Settings → Feature Flags

## Usage Examples

### Frontend (Vue/TypeScript)
```typescript
import { useFeatureFlagsStore } from '@/packages/moii-settings';

const featureFlagsStore = useFeatureFlagsStore();

// Load features
await featureFlagsStore.fetchFeatures();

// Check if feature is enabled
if (featureFlagsStore.isEnabled('new_dashboard')) {
    // Show new dashboard
}

// Toggle feature
await featureFlagsStore.toggleFeature('beta_ui', true);
```

### Backend (PHP)
```php
use Moii\Settings\Models\SystemSetting;

// Check feature in backend
if (SystemSetting::featureEnabled('new_dashboard')) {
    // Enable new functionality
}
```

## Feature Naming Convention

- Features are automatically prefixed with 'feature.' in the database
- Use lowercase with underscores for feature names (e.g., 'new_dashboard', 'beta_ui')
- Display names are automatically formatted (e.g., 'new_dashboard' becomes 'New Dashboard')

## Benefits

1. **No Code Deployments**: Toggle features without releasing new code
2. **A/B Testing**: Easily test different feature sets
3. **Gradual Rollouts**: Enable features for specific environments first
4. **Emergency Switches**: Quickly disable problematic features
5. **User-Friendly**: Non-technical users can manage features through UI

## File Structure

```
moii-settings/src/
├── stores/
│   └── featureFlags.ts          # Pinia store
├── components/
│   ├── FeatureFlagsHeader.vue   # Header with search/filter
│   └── FeatureFlagModal.vue     # Add/edit modal
├── views/
│   └── FeatureFlagsList.vue     # Main feature flags view
└── router/
    └── index.ts                 # Updated with feature flags route
```

The feature flags system integrates seamlessly with the existing moii-settings backend infrastructure while providing a dedicated, user-friendly interface for feature management.
