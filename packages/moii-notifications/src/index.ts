// Stores
export { useNotificationsStore } from './stores/notifications';
export type {
    Notification,
    NotificationList,
    NotificationDelivery,
    CreateNotificationData,
    UpdateNotificationData,
    NotificationsResponse,
    NotificationListsResponse,
    NotificationDeliveriesResponse,
    NotificationStatistics
} from './stores/notifications';

// Composables
export { default as useNotificationChannels } from './composables/useNotificationChannels';

// Router
export { default as notificationRoutes } from './router';

// Components
export { default as NotificationsList } from './views/NotificationsList.vue';
export { default as NotificationForm } from './views/NotificationForm.vue';
export { default as NotificationDetail } from './views/NotificationDetail.vue';
export { default as NotificationLists } from './views/NotificationLists.vue';
export { default as NotificationListForm } from './views/NotificationListForm.vue';
export { default as NotificationListDetail } from './views/NotificationListDetail.vue';
export { default as NotificationDeliveries } from './views/NotificationDeliveries.vue';
export { default as NotificationsHeader } from './components/NotificationsHeader.vue';
export { default as NotificationModal } from './components/NotificationModal.vue';
export { default as NotificationListModal } from './components/NotificationListModal.vue';
export { default as NotificationChannelsSelector } from './components/NotificationChannelsSelector.vue';
export { default as NotificationRecipientsSelector } from './components/NotificationRecipientsSelector.vue';
export { default as NotificationEditor } from './components/NotificationEditor.vue';

// Icons
export { default as IconNotifications } from './components/icon/icon-notifications.vue';
export { default as IconNotificationList } from './components/icon/icon-notification-list.vue';
export { default as IconNotificationDelivery } from './components/icon/icon-notification-delivery.vue';
export { default as IconMail } from './components/icon/icon-mail.vue';
export { default as IconMessage } from './components/icon/icon-message.vue';
export { default as IconBell } from './components/icon/icon-bell.vue';
export { default as IconSend } from './components/icon/icon-send.vue';
export { default as IconSchedule } from './components/icon/icon-schedule.vue';
export { default as IconCancel } from './components/icon/icon-cancel.vue';
export { default as IconDraft } from './components/icon/icon-draft.vue';
export { default as IconEye } from './components/icon/icon-eye.vue';
export { default as IconEdit } from './components/icon/icon-edit.vue';
export { default as IconPlus } from './components/icon/icon-plus.vue';
export { default as IconDotsVertical } from './components/icon/icon-dots-vertical.vue';
export { default as IconTrash } from './components/icon/icon-trash.vue';
export { default as IconUsers } from './components/icon/icon-users.vue';
export { default as IconUser } from './components/icon/icon-user.vue';
export { default as IconList } from './components/icon/icon-list.vue';
