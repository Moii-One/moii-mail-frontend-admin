# moii-example Package

This is an example package demonstrating how multiple packages can work together with the main authentication system in a Vue.js application.

## Package Structure

```
packages/moii-example/
├── src/
│   ├── composables/
│   │   └── useAuth.ts          # Package-specific authentication rules
│   ├── router/
│   │   └── index.ts            # Package routes
│   ├── stores/
│   │   └── example.ts          # Package-specific Pinia store
│   ├── views/
│   │   ├── Welcome.vue         # Public welcome page
│   │   ├── PublicDemo.vue      # Public demo page
│   │   ├── Dashboard.vue       # Protected dashboard
│   │   ├── Profile.vue         # Protected profile page
│   │   └── Settings.vue        # Protected settings page
│   └── index.ts                # Main package exports
└── package.json
```

## Features Demonstrated

### 1. **Independent Routing System**
- Each package can define its own routes
- Routes are imported and spread into the main router
- Package routes use the same Vue Router instance

### 2. **Package-Specific Authentication Rules**
- `useAuth.ts` composable defines auth rules for this package
- Public routes: `/example/welcome`, `/example/public-demo`
- Protected routes: All `/example/*` routes require authentication
- Integrates with main authentication system

### 3. **Dedicated Pinia Store**
- `useExampleStore` manages package-specific state
- Counter functionality with computed values
- User preferences (theme, language)
- Package data management

### 4. **Composable Architecture**
- Clean separation of concerns
- Reusable authentication logic
- Easy integration with main app

## Integration with Main Application

### Router Integration
```typescript
// /admin/src/router/index.ts
import { authRoutes } from '../../packages/moii-auth/src/router';
import { exampleRoutes } from '../../packages/moii-example/src/router';
import { requiresAuth, isAuthenticated, getLoginRedirect } from '../../packages/moii-auth/src/composables/useAuth';
import { requiresAuth as exampleRequiresAuth } from '../../packages/moii-example/src/composables/useAuth';

// Combined authentication check
if (requiresAuth(to) || exampleRequiresAuth(to)) {
    if (!isAuthenticated()) {
        // Redirect to login
    }
}

const routes = [
    ...authRoutes,
    ...exampleRoutes,
    // other routes
];
```

### Authentication Flow
1. **Public Routes**: `/example/welcome`, `/example/public-demo` - No authentication required
2. **Protected Routes**: `/example/dashboard`, `/example/profile`, `/example/settings` - Authentication required
3. **Redirect Logic**: Unauthenticated users are redirected to `/login?redirect=/example/dashboard`
4. **Post-Login**: After successful login, users are redirected to their intended destination

## Usage Examples

### Accessing Package Routes
```vue
<template>
  <router-link to="/example/dashboard">Go to Example Dashboard</router-link>
</template>
```

### Using Package Store
```vue
<script setup>
import { useExampleStore } from '../../../packages/moii-example/src/stores/example';

const exampleStore = useExampleStore();

// Reactive data
const counter = computed(() => exampleStore.counter);

// Actions
const increment = () => exampleStore.incrementCounter();
</script>
```

### Package-Specific Auth Check
```vue
<script setup>
import { requiresAuth } from '../../../packages/moii-example/src/composables/useAuth';

// Check if current route requires auth for this package
const needsAuth = requiresAuth(route);
</script>
```

## Testing the Package

1. **Public Access**: Visit `/example/welcome` or `/example/public-demo` without logging in
2. **Protected Access**: Try accessing `/example/dashboard` without authentication (should redirect to login)
3. **Post-Login Redirect**: Login and verify you're redirected to the intended protected route
4. **Store Functionality**: Test counter, theme switching, and data management in the dashboard

## Extending the Pattern

This pattern can be used to create additional packages:

1. **Create Package Structure**: Copy the folder structure
2. **Define Routes**: Create package-specific routes in `router/index.ts`
3. **Add Auth Rules**: Implement package-specific auth logic in `composables/useAuth.ts`
4. **Create Store**: Add package-specific state management in `stores/`
5. **Integrate**: Import routes and auth composables into main router
6. **Update Guard**: Add package auth check to main router's `beforeEach`

## Benefits

- **Modularity**: Each package is self-contained
- **Scalability**: Easy to add new packages
- **Consistency**: Shared authentication system
- **Maintainability**: Clear separation of concerns
- **Reusability**: Composable architecture
