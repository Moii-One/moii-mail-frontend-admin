import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/reviews',
        name: 'reviews',
        component: () => import('../views/ReviewsList.vue'),
        meta: {
            title: 'Reviews Management',
            requiresAuth: true,
            permissions: ['reviews.view']
        }
    },
];

export default routes;
