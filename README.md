# moii-mail (Frontend Admin)

Email template management and mail logs monitoring for moii platform

## Requirements

- Vue 3.3+
- TypeScript
- Pinia 2.1+
- Vite

## Installation

This package is part of the MOII Admin monorepo and is imported via relative paths.

## Package Structure

```
src/
├── index.ts          # Barrel exports
├── types.ts          # TypeScript interfaces
├── router/           # Vue Router routes
├── stores/           # Pinia stores (Composition API)
├── views/            # Page-level components
├── components/       # Package-specific components
└── composables/      # Vue composables
```

## Usage

Import in your Vue application:

```typescript
import { routes } from '../../packages/moii-mail/src/router';
import { useStore } from '../../packages/moii-mail/src/stores';
```

## License

MIT - Moii One

---
*Part of the MOII Platform - Admin Panel*
