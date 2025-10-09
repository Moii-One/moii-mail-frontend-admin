# Moii Apps Package

A Vue.js frontend package for managing multiple web and mobile applications within the Moii ecosystem.

## Features

- Complete CRUD interface for apps management
- Responsive data table with sorting and filtering
- Modal-based create/edit forms
- Statistics dashboard
- Type-based filtering (web, mobile, api)
- Status management (active, inactive, maintenance)
- Real-time search functionality

## Installation

The package is automatically included when the main admin application is set up. The routes and components are registered through the main router.

## Usage

### Navigation

Access the Apps Management interface through the sidebar under the "SYSTEM" section.

### Features

#### Apps List
- View all applications in a paginated table
- Filter by type (web, mobile, api) and status (active, inactive, maintenance)
- Search by application name or slug
- Sort by any column

#### Statistics Dashboard
- Total number of apps
- Count of active apps
- Count of web apps
- Count of mobile apps

#### Create/Edit Apps
- Modal-based forms for creating and editing applications
- Auto-generation of slugs from app names
- Validation for all required fields
- Support for custom configuration (JSON)

#### App Types
- **Web**: Web applications
- **Mobile**: Mobile applications
- **API**: API services

#### App Statuses
- **Active**: Application is live and operational
- **Inactive**: Application is disabled
- **Maintenance**: Application is under maintenance

## API Integration

The frontend communicates with the backend through RESTful APIs:

- `GET /api/apps` - List apps with filtering
- `POST /api/apps` - Create new app
- `GET /api/apps/{uuid}` - Get specific app
- `PUT /api/apps/{uuid}` - Update app
- `DELETE /api/apps/{uuid}` - Delete app
- `GET /api/apps/active` - Get active apps
- `GET /api/apps/type/{type}` - Get apps by type

## Architecture

### Components
- **AppsList.vue**: Main apps management view
- **AppsHeader.vue**: Header with filters and add button
- **AppModal.vue**: Modal for creating/editing apps
- **CustomSelect.vue**: Reusable select component

### Stores
- **apps.ts**: Pinia store for state management and API calls

### Composables
- **useAuth.ts**: Authentication utilities

### Routes
- `/apps`: Main apps management route

## Dependencies

- Vue 3
- Pinia for state management
- Vue Router
- @suadelabs/vue3-multiselect for select components
- @headlessui/vue for modal components
- vue-height-collapsible for collapsible sections

## Development

### Adding New Features

1. Update the backend API if needed
2. Add new methods to the `AppService` (backend)
3. Update the Pinia store with new actions
4. Modify components as needed
5. Update routes if new pages are added

### Styling

The package uses Tailwind CSS for styling and follows the main application's design system.

## License

MIT
