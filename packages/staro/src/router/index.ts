import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('../views/NotificationsList.vue'),
        meta: {
            title: 'Notifications Management',
            requiresAuth: true,
            permissions: ['notifications.view']
        }
    },
    {
        path: '/notifications/create',
        name: 'notifications-create',
        component: () => import('../views/NotificationForm.vue'),
        meta: {
            title: 'Create Notification',
            requiresAuth: true,
            permissions: ['notifications.create']
        }
    },
    {
        path: '/notifications/:id/edit',
        name: 'notifications-edit',
        component: () => import('../views/NotificationForm.vue'),
        meta: {
            title: 'Edit Notification',
            requiresAuth: true,
            permissions: ['notifications.update']
        }
    },
    {
        path: '/notifications/:id',
        name: 'notifications-view',
        component: () => import('../views/NotificationView.vue'),
        meta: {
            title: 'View Notification',
            requiresAuth: true,
            permissions: ['notifications.view']
        }
    },
    {
        path: '/notifications/lists',
        name: 'notification-lists',
        component: () => import('../views/NotificationListsList.vue'),
        meta: {
            title: 'Notification Lists',
            requiresAuth: true,
            permissions: ['notifications.lists.view']
        }
    },
    {
        path: '/notifications/lists/create',
        name: 'notification-lists-create',
        component: () => import('../views/NotificationListForm.vue'),
        meta: {
            title: 'Create Notification List',
            requiresAuth: true,
            permissions: ['notifications.lists.create']
        }
    },
    {
        path: '/notifications/lists/:id/edit',
        name: 'notification-lists-edit',
        component: () => import('../views/NotificationListForm.vue'),
        meta: {
            title: 'Edit Notification List',
            requiresAuth: true,
            permissions: ['notifications.lists.update']
        }
    },
    {
        path: '/notifications/lists/:id',
        name: 'notification-lists-view',
        component: () => import('../views/NotificationListView.vue'),
        meta: {
            title: 'View Notification List',
            requiresAuth: true,
            permissions: ['notifications.lists.view']
        }
    },
    {
        path: '/notifications/deliveries',
        name: 'notification-deliveries',
        component: () => import('../views/NotificationDeliveries.vue'),
        meta: {
            title: 'Notification Deliveries',
            requiresAuth: true,
            permissions: ['notifications.deliveries.view']
        }
    },
];

export default routes;
