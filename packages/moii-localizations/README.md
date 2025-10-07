# MOII Localizations Package

A Vue 3 + TypeScript package for managing application languages and translations with authentication integration.

## Features

### Languages Management
- Complete CRUD operations for languages
- Set default language
- Toggle language active/inactive status
- ISO 639-1 language code support

### Translations Management
- Manage translation strings per language
- Key-value based translations
- Search and filter capabilities
- Bulk update support
- JSON file-based storage

## Installation

This package is part of the MOII packages ecosystem and uses the auth package for authentication.

## Usage

### Import in your application

```typescript
import { localizationsRoutes, useLanguagesStore, useTranslationsStore } from './packages/moii-localizations';

// Add routes to your router
router.addRoute(localizationsRoutes);

// Use the stores
const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();
```

## Routes

- `/localizations/languages` - Languages management page
- `/localizations/translations` - Translations management page

## API Endpoints

### Languages
- `GET /api/localizations/languages` - List all languages
- `POST /api/localizations/languages` - Create a new language
- `PUT /api/localizations/languages/{code}` - Update a language
- `DELETE /api/localizations/languages/{code}` - Delete a language
- `PATCH /api/localizations/languages/{code}/default` - Set as default
- `PATCH /api/localizations/languages/{code}/toggle-active` - Toggle active status

### Translations
- `GET /api/localizations/translations/{languageCode}` - Get all translations
- `POST /api/localizations/translations/{languageCode}` - Set/update translation
- `POST /api/localizations/translations/{languageCode}/bulk` - Bulk update
- `DELETE /api/localizations/translations/{languageCode}/key/{key}` - Delete translation

## Configuration

Configure the API URLs in `config.json`:

```json
{
    "api_base_url": "http://localhost:8000/api/localizations",
    "languages_url": "http://localhost:8000/api/localizations/languages",
    "translations_url": "http://localhost:8000/api/localizations/translations"
}
```

## Data Models

### Language Model
```typescript
interface Language {
    id?: number;
    code: string;              // ISO 639-1 code (e.g., 'en', 'es')
    name: string;              // Language name (e.g., 'English')
    native_name?: string;      // Native name (e.g., 'English')
    is_default?: boolean;      // Is this the default language?
    is_active?: boolean;       // Is this language active?
    created_at?: string;
    updated_at?: string;
}
```

### Translation Model
```typescript
interface Translation {
    key: string;               // Translation key
    value: string;            // Translation value
}
```

