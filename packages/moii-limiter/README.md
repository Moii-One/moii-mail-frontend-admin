# Moii Limiter Frontend Package

A Vue 3 + TypeScript frontend package for managing rate limits in the admin panel.

## Features

- ✅ **Rate Limit Monitoring**: View all rate limits with their current status
- ✅ **Check Rate Limits**: Check specific rate limit status
- ✅ **Clear Rate Limits**: Clear individual or all rate limits
- ✅ **Pinia Store**: Centralized state management with Pinia
- ✅ **Authentication**: Protected routes with auth store integration
- ✅ **Search & Filter**: Filter rate limits by identifier, config key, status
- ✅ **Type Safety**: TypeScript support with proper type definitions
- ✅ **Real-time Status**: View attempts, remaining attempts, blocked status
- ✅ **Beautiful UI**: Modern design with TailwindCSS and HeadlessUI
- ✅ **Loading States**: Proper loading and error handling
- ✅ **Confirmation Dialogs**: SweetAlert2 for clear confirmations

## Installation

1. The package is located in `admin/packages/moii-limiter`

2. Configure the API URL in `config.json`:
```json
{
    "api_url": "http://localhost:8000/api/limiter"
}
```

3. Import the routes in your main router:
```typescript
import rateLimitsRoutes from '../../packages/moii-limiter/src/router';

const router = createRouter({
    routes: [
        ...rateLimitsRoutes,
        // other routes
    ]
});
```

## Usage

### Basic Usage

```vue
<template>
    <RateLimitsList />
</template>

<script setup>
import { RateLimitsList } from 'moii-limiter';
</script>
```

### Using the Store

```typescript
import { useRateLimitsStore } from 'moii-limiter';

const rateLimitsStore = useRateLimitsStore();

// Fetch rate limit statuses
await rateLimitsStore.fetchRateLimitStatuses('moii-localizations');

// Check a specific rate limit
const result = await rateLimitsStore.checkRateLimit('moii-localizations', 'user@example.com');

// Clear a specific rate limit
await rateLimitsStore.clearRateLimit('moii-localizations', 'user@example.com');

// Clear all rate limits for a config key
await rateLimitsStore.clearAllRateLimits('moii-localizations');
```

## API Endpoints

The package communicates with the following API endpoints:

- `GET /api/limiter/rate-limit/statuses` - Get all rate limit statuses
- `POST /api/limiter/rate-limit/check` - Check a specific rate limit
- `POST /api/limiter/rate-limit/clear` - Clear a specific rate limit
- `POST /api/limiter/rate-limit/clear-all` - Clear all rate limits

## Configuration

### Config Keys

Rate limits are organized by config keys. Common config keys include:
- `moii-localizations` - Translation operations
- `moii-auth` - Authentication operations
- `moii-settings` - Settings operations

### Rate Limit Structure

Each rate limit contains:
- `identifier`: Unique identifier (e.g., user ID, IP address)
- `config_key`: Configuration key for the rate limit
- `attempts`: Current number of attempts
- `max_attempts`: Maximum allowed attempts
- `remaining_attempts`: Remaining attempts before blocking
- `decay_minutes`: Minutes until rate limit resets
- `blocked`: Whether the identifier is currently blocked
- `blocked_until`: Timestamp when block expires

## Components

### RateLimitsList
Main component for displaying and managing rate limits.

**Props:**
- None

### RateLimitsHeader
Header component with filters and bulk actions.

**Props:**
- `title: string` - Page title
- `modelValue: RateLimitFilterModel` - Filter state
- `availableConfigKeys: string[]` - Available config keys for filtering

### CustomSelect
Reusable select component for filters.

## Store

### useRateLimitsStore

**State:**
- `rateLimitStatuses: RateLimitStatus[]` - Array of rate limit statuses
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**Getters:**
- `blockedRateLimits` - Rate limits that are currently blocked
- `activeRateLimits` - Rate limits that are active
- `totalRateLimits` - Total number of rate limits
- `getRateLimitByIdentifier(identifier)` - Get rate limit by identifier

**Actions:**
- `fetchRateLimitStatuses(configKey, identifier?)` - Fetch rate limit statuses
- `checkRateLimit(configKey, identifier)` - Check specific rate limit
- `clearRateLimit(configKey, identifier)` - Clear specific rate limit
- `clearAllRateLimits(configKey)` - Clear all rate limits for config key

## Routes

- `/rate-limits` - Rate limits management page

## Dependencies

- Vue 3
- Pinia
- TypeScript
- TailwindCSS
- @bhplugin/vue3-datatable
- @suadelabs/vue3-multiselect
- vue-height-collapsible
- sweetalert2

## Development

1. Make changes to the package files
2. Test the functionality in the admin panel
3. Update this README if new features are added

## Contributing

When adding new features:
1. Follow the existing code structure and patterns
2. Add proper TypeScript types
3. Include error handling
4. Update the README documentation
5. Test the functionality thoroughly
