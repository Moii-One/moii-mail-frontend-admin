import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsList.vue'),
        meta: {
            title: 'System Settings',
            requiresAuth: true,
            permissions: ['settings.view']
        },
    },
    {
        path: '/settings/feature-flags',
        name: 'feature-flags',
        component: () => import('../views/FeatureFlagsList.vue'),
        meta: {
            title: 'Feature Flags',
            requiresAuth: true,
            permissions: ['feature-flags.view']
        },
    },
];

export default routes;
