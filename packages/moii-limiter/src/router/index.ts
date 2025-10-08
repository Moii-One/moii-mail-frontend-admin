import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/rate-limits',
        name: 'rate-limits',
        component: () => import('../views/RateLimitsList.vue'),
        meta: {
            title: 'Rate Limits Management',
            requiresAuth: true,
        },
    },
];

export default routes;
