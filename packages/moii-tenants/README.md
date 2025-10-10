# Moii Tenants Frontend Package

This package provides the frontend components for managing tenants in the Moii system.

## Features

- List all tenants with filtering and search
- Create, edit, and delete tenants
- Block/unblock tenants
- Duplicate tenants
- Attach/detach apps to/from tenants
- Statistics dashboard

## Components

- `TenantsList.vue` - Main view for tenant management
- `TenantsHeader.vue` - Header with filters and add button
- `TenantModal.vue` - Modal for creating/editing tenants
- `CustomSelect.vue` - Custom select component

## Stores

- `useTenantsStore` - Pinia store for tenant management

## Routes

- `/tenants` - Tenants management page

## API Endpoints

The package communicates with the following backend endpoints:

- `GET /api/tenants` - Fetch all tenants
- `POST /api/tenants` - Create a new tenant
- `GET /api/tenants/active` - Fetch active tenants
- `GET /api/tenants/{uuid}` - Fetch a specific tenant
- `PUT /api/tenants/{uuid}` - Update a tenant
- `DELETE /api/tenants/{uuid}` - Delete a tenant
- `POST /api/tenants/{uuid}/duplicate` - Duplicate a tenant
- `POST /api/tenants/{uuid}/block` - Block a tenant
- `POST /api/tenants/{uuid}/unblock` - Unblock a tenant
- `POST /api/tenants/{uuid}/attach-app` - Attach an app to a tenant
- `POST /api/tenants/{uuid}/detach-app` - Detach an app from a tenant
