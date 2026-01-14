import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/localizations',
        redirect: '/localizations/languages',
    },
    {
        path: '/localizations/languages',
        name: 'localizations-languages',
        component: () => import('../views/LanguagesList.vue'),
        meta: {
            title: 'Languages',
            requiresAuth: true,
            permissions: ['languages.view']
        },
    },
    {
        path: '/localizations/translations',
        name: 'localizations-translations',
        component: () => import('../views/TranslationsList.vue'),
        meta: {
            title: 'Translations',
            requiresAuth: true,
            permissions: ['translations.view']
        },
    },
];

export default routes;
