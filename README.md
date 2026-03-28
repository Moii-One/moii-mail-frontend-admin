# moii-mail-frontend-admin

> Email template management and mail logs monitoring for moii platform

**Version:** v0.0.11 | **Part of:** [MOII Platform](https://github.com/Moii-One)

---

## Requirements

| Dependency | Version |
|------------|---------|
| Vue | ^3.3 |
| TypeScript | ^5.0 |
| Pinia | ^2.1 |
| Vite | ^5.0 |

---

## Installation

This package is part of the MOII Admin monorepo. Import via relative paths:

```typescript
// Register routes in admin/src/router/index.ts
import mailRoutes from '../../packages/moii-mail/src/router';
const routes = [...coreRoutes, ...mailRoutes];
```

---

## Package Structure

```
moii-mail/
├── config.json           # API URL and package config
├── package.json
└── src/
    ├── index.ts           # Barrel exports
    ├── types.ts           # TypeScript interfaces
    ├── router/            # Vue Router route definitions
    ├── stores/            # Pinia Composition API stores
    ├── views/             # Page-level components
    ├── components/        # Reusable components
    └── composables/       # Vue composables
```

---
## Views

```
- MailLogDetail
- MailLogs
- TemplateDetail
- TemplateForm
- Templates
```

---
## Routes

```
- /mail/templates
- /mail/templates/create
- /mail/templates/:id/edit
- /mail/templates/:id
- /mail/logs
- /mail/logs/:id
```

---
## Stores

```
- useUmail
- useUtemplates
```

---
## Composables

```
- useMailStatus
- useTemplateVariables
```

---
## Components

```
- MailLogsHeader
- TemplatePreviewModal
- TemplatesHeader
```

---

## API Integration

Default API URL: `http://localhost:8000/api/mail`All API calls use native `fetch` with auth headers from `moii-auth`:

```typescript
import { getAuthHeaders } from '../../../moii-auth/src/utils/http';

const response = await fetch(`${config.api_url}/endpoint`, {
    headers: getAuthHeaders()
});
```

---

## Permissions

Routes use the `meta.permissions` field checked via the `usePermissions()` composable.

---

## License

MIT — © 2026 Moii One

---

*Part of the [MOII Platform](https://github.com/Moii-One) — Admin Frontend Package*
