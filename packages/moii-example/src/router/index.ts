import { RouteRecordRaw } from 'vue-router';

export const exampleRoutes: RouteRecordRaw[] = [
    // Public routes (don't require authentication)
    {
        path: '/example/welcome',
        name: 'example-welcome',
        component: () => import('../views/Welcome.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/example/public-demo',
        name: 'example-public-demo',
        component: () => import('../views/PublicDemo.vue'),
        meta: { layout: 'auth' }
    },

    // Protected routes (require authentication)
    {
        path: '/example/dashboard',
        name: 'example-dashboard',
        component: () => import('../views/Dashboard.vue')
    },
    {
        path: '/example/profile',
        name: 'example-profile',
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/example/settings',
        name: 'example-settings',
        component: () => import('../views/Settings.vue')
    }
];
