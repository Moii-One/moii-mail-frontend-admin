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
    },
    {
        path: '/users/:userUuid/roles',
        name: 'user-roles',
        component: () => import('../views/UserRolesList.vue'),
        meta: {
            title: 'User Roles & Permissions',
            requiresAuth: true,
            permissions: ['users.view', 'roles.view']
        }
    },
    {
        path: '/roles',
        name: 'roles',
        component: () => import('../views/RolesList.vue'),
        meta: {
            title: 'Roles Management',
            requiresAuth: true,
            permissions: ['roles.view']
        }
    },
    {
        path: '/permissions',
        name: 'permissions',
        component: () => import('../views/PermissionsList.vue'),
        meta: {
            title: 'Permissions Management',
            requiresAuth: true,
            permissions: ['permissions.view']
        }
    }
];

export default routes;
