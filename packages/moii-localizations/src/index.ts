// Export routes
export { default as localizationsRoutes } from './router';

// Export stores
export { useLanguagesStore } from './stores/languages';
export type { Language } from './stores/languages';
export { useTranslationsStore } from './stores/translations';
export type { Translation } from './stores/translations';

// Export composables
export { requiresAuth, isAuthenticated, getLoginRedirect } from './composables/useAuth';

// Export components
export { default as LanguagesHeader } from './components/LanguagesHeader.vue';
export { default as TranslationsHeader } from './components/TranslationsHeader.vue';
export { default as LanguageModal } from './components/LanguageModal.vue';
export { default as TranslationModal } from './components/TranslationModal.vue';

// Export views
export { default as LanguagesList } from './views/LanguagesList.vue';
export { default as TranslationsList } from './views/TranslationsList.vue';
