// Export routes
export { default as settingsRoutes } from './router';

// Export stores
export { useSettingsStore } from './stores/settings';
export type { Setting } from './stores/settings';

// Export composables
export { requiresAuth, isAuthenticated, getLoginRedirect } from './composables/useAuth';

// Export views
export { default as SettingsList } from './views/SettingsList.vue';
