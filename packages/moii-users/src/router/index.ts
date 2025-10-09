import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/users',
        name: 'users',
        component: () => import('../views/UsersList.vue'),
        meta: {
            title: 'User Management',
            requiresAuth: true,
            permissions: ['users.view']
        }
    },
    {
        path: '/users/:userUuid/sessions',
        name: 'user-sessions',
        component: () => import('../views/SessionsList.vue'),
        meta: {
            title: 'User Sessions',
            requiresAuth: true,
            permissions: ['users.view']
        }
    }
];

export default routes;
