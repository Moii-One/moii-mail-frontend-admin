# MOII User Settings Package Summary

## Package Overview
The MOII User Settings package provides a comprehensive solution for managing user-specific settings with UUID support. It allows users to store, retrieve, and manage their personal configuration data with encryption support and type safety.

## Key Features
- **UUID Support**: All user settings have UUID identifiers for secure and scalable operations
- **Type Safety**: Support for string, integer, boolean, float, JSON, and array types
- **Encryption**: Optional encryption for sensitive settings
- **Caching**: Built-in caching for performance optimization
- **Bulk Operations**: Support for updating multiple settings at once
- **Prefix-based Retrieval**: Get settings by key prefix for organized data access

## Core Components

### Models
- **UserSetting**: Main model with UUID trait, handles CRUD operations, caching, and type casting

### Controllers
- **UserSettingsController**: RESTful API endpoints with UUID-based operations

### Traits
- **HasUuid**: Provides UUID functionality for the UserSetting model

## Database Structure

### user_settings Table
- `id` (primary key)
- `uuid` (unique identifier)
- `user_id` (foreign key to users)
- `key` (setting key)
- `value` (setting value)
- `type` (data type: string, integer, boolean, float, json, array)
- `is_encrypted` (boolean flag for encryption)
- `description` (optional description)
- `timestamps`

## API Endpoints

### Core Operations
- `GET /api/user-settings` - Get all user settings
- `GET /api/user-settings/{key}` - Get specific setting by key
- `GET /api/user-settings/uuid/{uuid}` - Get setting by UUID
- `POST /api/user-settings` - Create/update a setting
- `DELETE /api/user-settings/{key}` - Delete setting by key
- `DELETE /api/user-settings/uuid/{uuid}` - Delete setting by UUID

### Bulk Operations
- `POST /api/user-settings/bulk` - Update multiple settings
- `DELETE /api/user-settings` - Delete all user settings

### Utility Operations
- `GET /api/user-settings/prefix/{prefix}` - Get settings by key prefix

## Authentication
- All endpoints require authentication via Sanctum
- Settings are scoped to the authenticated user

## Frontend Integration

### Store (Pinia)
```typescript
// Store provides reactive state management
const userSettingsStore = useUserSettingsStore();

// Basic operations
await userSettingsStore.fetchAllSettings();
await userSettingsStore.setSetting('theme', 'dark', 'string');
const theme = await userSettingsStore.getSetting('theme');

// UUID-based operations
await userSettingsStore.getSettingByUuid('some-uuid');
await userSettingsStore.deleteSettingByUuid('some-uuid');

// Bulk operations
await userSettingsStore.updateBulkSettings([
  { key: 'theme', value: 'dark', type: 'string' },
  { key: 'language', value: 'en', type: 'string' }
]);
```

### TypeScript Interface
```typescript
interface UserSetting {
    uuid?: string;
    key: string;
    value: any;
    type?: string;
    is_encrypted?: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
```

## Cache Integration
- Uses MOII Cache service for performance
- Automatic cache invalidation on updates
- Configurable TTL and cache keys

## Security Features
- Optional field-level encryption
- User-scoped access control
- UUID-based operations for enhanced security
- Input validation and sanitization

## Usage Examples

### Basic Setting Management
```php
// Backend
UserSetting::set($userId, 'notifications.email', true, 'boolean');
$emailNotifs = UserSetting::get($userId, 'notifications.email', false);

// Frontend
await userSettingsStore.setSetting('notifications.email', true, 'boolean');
const emailNotifs = await userSettingsStore.getSetting('notifications.email');
```

### Encrypted Settings
```php
// Store sensitive data with encryption
UserSetting::set($userId, 'api_key', 'secret-key', 'string', true);
```

### Prefix-based Retrieval
```php
// Get all notification settings
$notificationSettings = UserSetting::getByPrefix($userId, 'notifications');
```

## Migration Support
The package includes migrations to add UUID support to existing installations:
- Adds UUID column to user_settings table
- Populates UUIDs for existing records
- Makes UUID required and unique

## Configuration
Settings are configured through the application's environment and config files, with support for custom cache drivers and encryption methods.
