// Export routes
export { default as tenantsRoutes } from './router';

// Export stores
export { useTenantsStore } from './stores/tenants';
export type { Tenant, App } from './stores/tenants';

// Export composables
export { requiresAuth, isAuthenticated, getLoginRedirect } from './composables/useAuth';

// Export components
export { default as TenantsHeader } from './components/TenantsHeader.vue';
export { default as TenantModal } from './components/TenantModal.vue';

// Export views
export { default as TenantsList } from './views/TenantsList.vue';
