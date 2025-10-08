# Moii Settings Frontend Package

A Vue 3 + TypeScript frontend package for managing system settings in the admin panel.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete settings
- ✅ **Pinia Store**: Centralized state management with Pinia
- ✅ **Authentication**: Protected routes with auth store integration
- ✅ **Search & Filter**: Search settings by key, group, or description
- ✅ **Type Safety**: TypeScript support with proper type definitions
- ✅ **Multiple Data Types**: Support for string, integer, float, boolean, JSON, and array types
- ✅ **Visibility Control**: Public/Private settings
- ✅ **Group Organization**: Organize settings by groups (e.g., general, email, payment)
- ✅ **Beautiful UI**: Modern design with TailwindCSS and HeadlessUI
- ✅ **Loading States**: Proper loading and error handling
- ✅ **Confirmation Dialogs**: SweetAlert2 for delete confirmations

## Installation

1. The package is located in `admin/packages/moii-settings`

2. Configure the API URL in `config.json`:
```json
{
    "api_url": "http://localhost:8000/api/settings"
}
```

3. Import the routes in your main router (already done):
```typescript
import settingsRoutes from '../../packages/moii-settings/src/router';
import { requiresAuth as settingsRequiresAuth } from '../../packages/moii-settings/src/composables/useAuth';

const router = createRouter({
    routes: [
        ...settingsRoutes,
        // other routes
    ]
});

// In beforeEach guard
router.beforeEach((to, from, next) => {
    if (settingsRequiresAuth(to)) {
        // check authentication
    }
});
```

## Usage

### Using the Store

```typescript
import { useSettingsStore } from './packages/moii-settings/src/stores/settings';

const settingsStore = useSettingsStore();

// Fetch all settings
await settingsStore.fetchSettings();

// Access settings
console.log(settingsStore.settings);
console.log(settingsStore.publicSettings);
console.log(settingsStore.settingsByGroup);

// Create setting
await settingsStore.createSetting({
    key: 'app_name',
    value: 'My App',
    type: 'string',
    group: 'general',
    description: 'Application name',
    is_public: true
});

// Update setting
await settingsStore.updateSetting(1, { value: 'New Value' });

// Delete setting
await settingsStore.deleteSetting(1);

// Get setting by key
const setting = settingsStore.getSettingByKey('app_name');
```

### Route

The package adds the following route:
- `/settings` - Settings management page

### API Interface

The composable expects the following API endpoints:

- `GET /api/settings` - List all settings
- `GET /api/settings/{key}` - Get setting by key
- `POST /api/settings` - Create new setting
- `PUT /api/settings/{id}` - Update setting
- `DELETE /api/settings/{id}` - Delete setting

### Setting Schema

```typescript
interface Setting {
    id?: number;
    key: string;
    value: any;
    type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array';
    group?: string | null;
    description?: string | null;
    is_public: boolean;
    created_at?: string;
    updated_at?: string;
}
```

## Components

### SettingsList.vue

Main component that displays:
- Settings table with search functionality
- Add/Edit modal dialog
- Delete confirmation
- Type-based value formatting
- Badge indicators for types and visibility

### useSettingsStore (Pinia Store)

Provides reactive state and methods:

**State:**
- `settings` - Array of settings
- `loading` - Loading state
- `error` - Error state

**Getters:**
- `publicSettings` - Filtered public settings
- `settingsByGroup` - Settings grouped by group name
- `getSettingByKey(key)` - Find setting by key

**Actions:**
- `fetchSettings()` - Fetch all settings
- `createSetting(setting)` - Create new setting
- `updateSetting(id, setting)` - Update existing setting
- `deleteSetting(id)` - Delete setting
- `fetchSettingByKey(key)` - Get setting by key
- `clearError()` - Clear error state

### useAuth Composable

Authentication helpers:
- `requiresAuth(to)` - Check if route requires auth
- `isAuthenticated()` - Check if user is authenticated
- `getLoginRedirect(to)` - Get login redirect path

## Features Detail

### Type Support

The package handles value conversion based on type:
- **string**: Plain text values
- **number**: Numeric values with automatic conversion
- **boolean**: True/false values
- **json**: Complex JSON objects
- **array**: Array data structures

### Search Functionality

Search works across:
- Setting key
- Group name
- Description text

### UI Components Used

- **HeadlessUI Dialog**: For modals
- **SweetAlert2**: For confirmations and notifications
- **TailwindCSS**: For styling
- **Table**: Striped and hover effects

## Dependencies

The package uses icons from the main admin app:
- `icon-plus` - Add button
- `icon-search` - Search input
- `icon-x` - Close button

Make sure these icon components are available in `@/components/icon/`.

## Backend Integration

This frontend package works with the `moii/settings` Laravel package. Ensure the backend API is properly configured and accessible.

### Expected Backend Response Format

```json
{
    "data": [
        {
            "id": 1,
            "key": "app_name",
            "value": "My Application",
            "type": "string",
            "group": "general",
            "description": "Application name",
            "is_public": true,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]
}
```

## Styling

The package uses existing admin theme classes:
- `panel` - Container wrapper
- `btn btn-primary` - Primary buttons
- `btn btn-outline-danger` - Danger buttons
- `form-input` - Text inputs
- `form-select` - Select dropdowns
- `form-textarea` - Textarea fields
- `form-checkbox` - Checkboxes
- `badge badge-outline-*` - Type and visibility badges

## Error Handling

- Network errors are caught and displayed
- Validation errors show toast notifications
- Delete operations require confirmation
- Loading states prevent multiple submissions

## Development

To extend or modify:

1. **Add new fields**: Update `Setting` interface and form in `SettingsList.vue`
2. **Add filtering**: Modify `searchSettings()` function
3. **Custom API calls**: Extend `useSettings` composable
4. **Styling changes**: Update classes in `SettingsList.vue`

## License

Part of the Moii framework.
