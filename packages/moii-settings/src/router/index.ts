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
];

export default routes;
