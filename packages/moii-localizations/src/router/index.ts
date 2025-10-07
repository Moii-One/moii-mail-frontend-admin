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
        },
    },
    {
        path: '/localizations/translations',
        name: 'localizations-translations',
        component: () => import('../views/TranslationsList.vue'),
        meta: {
            title: 'Translations',
            requiresAuth: true,
        },
    },
];

export default routes;
