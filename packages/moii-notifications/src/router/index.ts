import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('../views/NotificationsList.vue'),
        meta: {
            title: 'Notifications',
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
            permissions: ['notifications.edit']
        },
        props: true
    },
    {
        path: '/notifications/:id',
        name: 'notifications-show',
        component: () => import('../views/NotificationDetail.vue'),
        meta: {
            title: 'Notification Details',
            requiresAuth: true,
            permissions: ['notifications.view']
        },
        props: true
    },
    {
        path: '/notification-lists',
        name: 'notification-lists',
        component: () => import('../views/NotificationLists.vue'),
        meta: {
            title: 'Notification Lists',
            requiresAuth: true,
            permissions: ['notification_lists.view']
        }
    },
    {
        path: '/notification-lists/create',
        name: 'notification-lists-create',
        component: () => import('../views/NotificationListForm.vue'),
        meta: {
            title: 'Create Notification List',
            requiresAuth: true,
            permissions: ['notification_lists.create']
        }
    },
    {
        path: '/notification-lists/:id/edit',
        name: 'notification-lists-edit',
        component: () => import('../views/NotificationListForm.vue'),
        meta: {
            title: 'Edit Notification List',
            requiresAuth: true,
            permissions: ['notification_lists.edit']
        },
        props: true
    },
    {
        path: '/notification-lists/:id',
        name: 'notification-lists-show',
        component: () => import('../views/NotificationListDetail.vue'),
        meta: {
            title: 'Notification List Details',
            requiresAuth: true,
            permissions: ['notification_lists.view']
        },
        props: true
    },
    {
        path: '/notification-deliveries',
        name: 'notification-deliveries',
        component: () => import('../views/NotificationDeliveries.vue'),
        meta: {
            title: 'Delivery Reports',
            requiresAuth: true,
            permissions: ['notification_deliveries.view']
        }
    },
];

export default routes;
