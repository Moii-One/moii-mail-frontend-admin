import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/apps',
        name: 'apps',
        component: () => import('../views/AppsList.vue'),
        meta: {
            title: 'Apps Management',
            requiresAuth: true,
        },
    },
];

export default routes;
