// Stores
export { useNotificationsStore } from './stores/notifications';
export { useNotificationListsStore } from './stores/notificationLists';
export { useNotificationDeliveriesStore } from './stores/deliveries';

export type {
    Notification,
    NotificationRecipient,
    NotificationDelivery,
    CreateNotificationData,
    UpdateNotificationData,
    NotificationsResponse,
    NotificationStatistics,
} from './stores/notifications';

export type {
    NotificationList,
    CreateListData,
    UpdateListData,
    ListsResponse,
    ListUsersResponse,
} from './stores/notificationLists';

export type {
    NotificationDelivery as Delivery,
    DeliveryStatistics,
    DeliveriesResponse,
} from './stores/deliveries';

// Composables
export { requiresAuth } from './composables/useAuth';

// Router
export { default as notificationRoutes } from './router';

// Views
export { default as NotificationsList } from './views/NotificationsList.vue';
export { default as NotificationListsList } from './views/NotificationListsList.vue';

// Icons
export { default as IconBell } from './components/icons/IconBell.vue';
