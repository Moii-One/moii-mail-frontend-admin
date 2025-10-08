import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsList.vue'),
        meta: {
            title: 'System Settings',
            requiresAuth: true,
        },
    },
    {
        path: '/settings/feature-flags',
        name: 'feature-flags',
        component: () => import('../views/FeatureFlagsList.vue'),
        meta: {
            title: 'Feature Flags',
            requiresAuth: true,
        },
    },
];

export default routes;
