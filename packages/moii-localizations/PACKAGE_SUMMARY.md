# MOII Localizations Package Summary

## Overview
The MOII Localizations package is a comprehensive Vue 3 + TypeScript solution for managing application localizations with full CRUD operations and authentication integration.

# MOII Localizations Package Summary

## Overview
The MOII Localizations package is a comprehensive Vue 3 + TypeScript solution for managing application languages and translation strings with full CRUD operations and authentication integration.

## Package Structure

```
moii-localizations/
├── config.json                          # API configuration
├── README.md                            # Package documentation
├── PACKAGE_SUMMARY.md                   # This file
└── src/
    ├── index.ts                         # Main exports
    ├── components/
    │   ├── LanguageModal.vue           # Add/Edit language modal
    │   └── TranslationModal.vue        # Add/Edit translation modal
    ├── composables/
    │   └── useAuth.ts                  # Auth utilities
    ├── router/
    │   └── index.ts                    # Route definitions
    ├── stores/
    │   ├── languages.ts                # Pinia store for languages
    │   └── translations.ts             # Pinia store for translations
    └── views/
        ├── LanguagesList.vue           # Languages management view
        └── TranslationsList.vue        # Translations management view
```

## Features

### Languages Management
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Set default language
- ✅ Toggle language active/inactive status
- ✅ ISO 639-1 language code validation
- ✅ Native name support
- ✅ Authentication-aware API requests

### Translations Management
- ✅ Manage translation strings per language
- ✅ Key-value based translations
- ✅ Search and filter capabilities
- ✅ Add/Edit/Delete individual translations
- ✅ Bulk update support (via API)
- ✅ JSON file-based storage
- ✅ Dot notation key support (e.g., auth.login.title)

## Data Models

### Language Model
```typescript
interface Language {
    id?: number;
    code: string;              // ISO 639-1 code (2-3 letters)
    name: string;              // Language name
    native_name?: string;      // Native language name
    is_default?: boolean;      // Default language flag
    is_active?: boolean;       // Active status
    created_at?: string;
    updated_at?: string;
}
```

### Translation Model
```typescript
interface Translation {
    key: string;               // Translation key (supports dot notation)
    value: string;            // Translation value
}
```

## Routes

### Frontend Routes
- `/localizations` - Redirects to languages page
- `/localizations/languages` - Languages management
- `/localizations/translations` - Translations management

Both routes require authentication.

## Stores (Pinia)

### Languages Store
**State**:
- languages: Language[]
- loading: boolean
- error: string | null

**Getters**:
- activeLanguages
- defaultLanguage
- getLanguageByCode(code: string)

**Actions**:
- fetchLanguages()
- createLanguage(language)
- updateLanguage(code, language)
- deleteLanguage(code)
- setDefault(code)
- toggleActive(code)
- clearError()

### Translations Store
**State**:
- translations: Record<string, any>
- keys: string[]
- currentLanguage: string
- loading: boolean
- error: string | null

**Actions**:
- fetchTranslations(languageCode)
- fetchKeys(languageCode)
- setTranslation(languageCode, key, value)
- bulkUpdate(languageCode, translations)
- deleteTranslation(languageCode, key)
- clearError()

## API Integration

### Languages Endpoints
- `GET /api/localizations/languages` - List all languages
- `POST /api/localizations/languages` - Create language
- `PUT /api/localizations/languages/{code}` - Update language
- `DELETE /api/localizations/languages/{code}` - Delete language
- `PATCH /api/localizations/languages/{code}/default` - Set default
- `PATCH /api/localizations/languages/{code}/toggle-active` - Toggle status

### Translations Endpoints
- `GET /api/localizations/translations/{languageCode}` - Get translations
- `POST /api/localizations/translations/{languageCode}` - Set/update translation
- `POST /api/localizations/translations/{languageCode}/bulk` - Bulk update
- `DELETE /api/localizations/translations/{languageCode}/key/{key}` - Delete
- `GET /api/localizations/translations/{languageCode}/keys` - Get all keys
- `GET /api/localizations/translations/{languageCode}/last-modified` - Last modified

## Components

### LanguageModal
- Add/Edit language dialog
- Form validation
- Code input (disabled on edit)
- Name and native name inputs
- Active status checkbox
- HeadlessUI transition animations

### TranslationModal
- Add/Edit translation dialog
- Key input (disabled on edit, supports dot notation)
- Value textarea for translation
- Form validation

### LanguagesList View
- Table view of all languages
- Status badges (Active/Inactive, Default)
- Action buttons (Edit, Set Default, Toggle Active, Delete)
- Cannot delete default language
- Loading and error states

### TranslationsList View
- Language selector dropdown (shows active languages only)
- Search functionality for translations
- Table view of translation key-value pairs
- Add/Edit/Delete actions per translation
- Auto-loads first active language on mount

## Authentication
- Uses Bearer token from auth store
- Automatic header injection
- Error handling for unauthorized requests
- Protected routes requiring authentication

## Usage Example

```typescript
// In your main application
import { 
  localizationsRoutes, 
  useLanguagesStore, 
  useTranslationsStore 
} from './packages/moii-localizations';

// Add to router
router.addRoute(localizationsRoutes);

// Use in component
const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();

// Load languages
await languagesStore.fetchLanguages();

// Load translations for a language
await translationsStore.fetchTranslations('en');
```

## Dependencies
- Vue 3
- TypeScript
- Pinia (state management)
- Vue Router
- HeadlessUI (modals)
- SweetAlert2 (notifications)
- Auth package (moii-auth)

## Navigation
The package adds a "Localizations" dropdown menu in the sidebar with:
- Languages - Manage application languages
- Translations - Manage translation strings

## Configuration
API URLs are configurable via `config.json`:
```json
{
    "api_base_url": "http://localhost:8000/api/localizations",
    "languages_url": "http://localhost:8000/api/localizations/languages",
    "translations_url": "http://localhost:8000/api/localizations/translations"
}
```

## Type Safety
All components and functions are fully typed with TypeScript for better developer experience and compile-time error checking.

## Workflow

1. **Create Languages**: Add languages like English (en), Spanish (es), etc.
2. **Set Default**: Mark one language as default
3. **Activate Languages**: Toggle languages active/inactive
4. **Add Translations**: Select a language and add translation key-value pairs
5. **Manage Translations**: Edit or delete translation strings as needed

The system stores translations in JSON files on the backend, making it easy to version control and deploy.

## Features

### Core Functionality
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Authentication-aware API requests
- ✅ Type-safe with TypeScript
- ✅ Pinia store for centralized state management
- ✅ Real-time filtering and search
- ✅ Group-based organization
- ✅ Public/Private visibility control

### Data Model
```typescript
interface Localization {
    id?: number;
    uuid?: string;
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    group?: string | null;
    description?: string | null;
    is_public: boolean;
    created_at?: string;
    updated_at?: string;
}
```

### Components

#### LocalizationsHeader
- Search functionality
- Type filtering (string, number, boolean, json, array)
- Group filtering
- Visibility filtering (public/private)
- Add new localization button
- Collapsible filters panel

#### LocalizationModal
- Add/Edit dialog
- Form validation
- Value type conversion
- JSON validation for complex types
- HeadlessUI transition animations

### Store (Pinia)
- **State**: localizations, loading, error
- **Getters**: 
  - publicLocalizations
  - localizationsByGroup
  - getLocalizationByKey
- **Actions**:
  - fetchLocalizations()
  - createLocalization()
  - updateLocalization()
  - deleteLocalization()
  - fetchLocalizationByKey()
  - clearError()

### Routing
- Path: `/localizations`
- Protected route (requires authentication)
- Lazy-loaded component

## API Integration

### Expected Endpoints
- `GET /api/localizations` - List all localizations
- `POST /api/localizations` - Create new localization
- `PUT /api/localizations/{uuid}` - Update localization
- `DELETE /api/localizations/{uuid}` - Delete localization
- `GET /api/localizations/{key}` - Get by key

### Authentication
- Uses Bearer token from auth store
- Automatic header injection
- Error handling for unauthorized requests

## Usage Example

```typescript
// In your main application
import { localizationsRoutes, useLocalizationsStore } from './packages/moii-localizations';

// Add to router
router.addRoute(localizationsRoutes);

// Use in component
const localizationsStore = useLocalizationsStore();
await localizationsStore.fetchLocalizations();
```

## Dependencies
- Vue 3
- TypeScript
- Pinia (state management)
- Vue Router
- HeadlessUI (modals)
- vue-height-collapsible (accordions)
- SweetAlert2 (notifications)
- Auth package (moii-auth)

## Relationship with Other Packages
- **Depends on**: moii-auth (for authentication)
- **Similar to**: moii-settings (same structure and patterns)
- **Position**: Hidden between auth and settings in the navigation

## Configuration
API URL is configurable via `config.json`:
```json
{
    "api_url": "http://localhost:8000/api/localizations"
}
```

## Type Safety
All components and functions are fully typed with TypeScript for better developer experience and compile-time error checking.
