// Export routes
export { default as settingsRoutes } from './router';

// Export stores
export { useSettingsStore } from './stores/settings';
export type { Setting } from './stores/settings';
export { useFeatureFlagsStore } from './stores/featureFlags';
export type { FeatureFlag } from './stores/featureFlags';

// Export composables
export { requiresAuth, isAuthenticated, getLoginRedirect } from './composables/useAuth';

// Export components
export { default as FeatureFlagsHeader } from './components/FeatureFlagsHeader.vue';
export { default as FeatureFlagModal } from './components/FeatureFlagModal.vue';

// Export views
export { default as SettingsList } from './views/SettingsList.vue';
export { default as FeatureFlagsList } from './views/FeatureFlagsList.vue';
