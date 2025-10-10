import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/tenants',
        name: 'tenants',
        component: () => import('../views/TenantsList.vue'),
        meta: {
            title: 'Tenants Management',
            requiresAuth: true,
        },
    },
];

export default routes;
