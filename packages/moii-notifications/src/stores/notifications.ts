import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface Notification {
    id: number;
    uuid: string;
    title: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
    channels: string[];
    scheduled_at?: string;
    sent_at?: string;
    settings?: any;
    template_data?: any;
    created_by: number;
    total_recipients: number;
    delivered_count: number;
    failed_count: number;
    recipients_count?: number;
    sent_count?: number;
    opened_count?: number;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface NotificationList {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    filters?: any;
    is_dynamic: boolean;
    created_by: number;
    users_count: number;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface NotificationDelivery {
    id: number;
    notification_id: number;
    recipient_type: 'user' | 'list' | 'external';
    recipient_id?: number;
    email?: string;
    phone?: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    sent_at?: string;
    delivered_at?: string;
    failed_at?: string;
    error_message?: string;
    opened_at?: string;
    clicked_at?: string;
}

export interface CreateNotificationData {
    title: string;
    content: string;
    excerpt?: string;
    status?: 'draft' | 'scheduled';
    channels: string[];
    scheduled_at?: string;
    settings?: any;
    template_data?: any;
    recipients: Array<{
        type: 'user' | 'list' | 'external';
        user_id?: string;
        list_id?: number;
        email?: string;
        phone?: string;
        push_tokens?: string[];
    }>;
}

export interface UpdateNotificationData {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: 'draft' | 'scheduled';
    channels?: string[];
    scheduled_at?: string;
    settings?: any;
    template_data?: any;
    recipients?: Array<{
        type: 'user' | 'list' | 'external';
        user_id?: string;
        list_id?: number;
        email?: string;
        phone?: string;
        push_tokens?: string[];
    }>;
}

export interface NotificationsResponse {
    success: boolean;
    message: string;
    message_code: string;
    notifications?: Notification[];
    notification?: Notification;
    pagination?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface NotificationListsResponse {
    success: boolean;
    message: string;
    message_code: string;
    lists?: NotificationList[];
    list?: NotificationList;
}

export interface NotificationDeliveriesResponse {
    success: boolean;
    message: string;
    message_code: string;
    deliveries?: NotificationDelivery[];
    statistics?: any;
}

export interface NotificationStatistics {
    total: number;
    draft: number;
    scheduled: number;
    sent: number;
    failed: number;
    total_recipients: number;
    total_delivered: number;
    total_failed: number;
    delivery_rate: number;
}

export const useNotificationsStore = defineStore('notifications', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const notifications = ref<Notification[]>([]);
    const currentNotification = ref<Notification | null>(null);
    const lists = ref<NotificationList[]>([]);
    const deliveries = ref<NotificationDelivery[]>([]);
    const statistics = ref<NotificationStatistics | null>(null);
    const loading = ref(false);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
    });

    // Getters
    const draftNotifications = computed(() => notifications.value.filter(n => n.status === 'draft'));
    const scheduledNotifications = computed(() => notifications.value.filter(n => n.status === 'scheduled'));
    const sentNotifications = computed(() => notifications.value.filter(n => n.status === 'sent'));
    const failedNotifications = computed(() => notifications.value.filter(n => n.status === 'failed'));

    const dynamicLists = computed(() => lists.value.filter(l => l.is_dynamic));
    const manualLists = computed(() => lists.value.filter(l => !l.is_dynamic));

    // Actions
    async function fetchNotifications(params: any = {}) {
        loading.value = true;
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await fetch(`${API_URL}?${queryParams}`, {
                headers: sharedGetAuthHeaders(),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                // Backend returns { success: true, data: { notifications: [...], pagination: {...} } }
                if (data.data.notifications) {
                    notifications.value = data.data.notifications;
                }
                if (data.data.pagination) {
                    pagination.value = data.data.pagination;
                }
            }

            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchNotification(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                headers: sharedGetAuthHeaders(),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                currentNotification.value = data.data;
            }

            return data;
        } catch (error) {
            console.error('Error fetching notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function createNotification(notificationData: CreateNotificationData) {
        loading.value = true;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify(notificationData),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                notifications.value.unshift(data.data);
            }

            return data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function updateNotification(uuid: string, notificationData: UpdateNotificationData) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'PUT',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify(notificationData),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                const index = notifications.value.findIndex(n => n.uuid === uuid);
                if (index !== -1) {
                    notifications.value[index] = data.data;
                }
                if (currentNotification.value?.uuid === uuid) {
                    currentNotification.value = data.data;
                }
            }

            return data;
        } catch (error) {
            console.error('Error updating notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function deleteNotification(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'DELETE',
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            if (data.success) {
                notifications.value = notifications.value.filter(n => n.uuid !== uuid);
            }

            return data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function sendNotification(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}/send`, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            if (data.success) {
                await fetchNotification(uuid);
            }

            return data;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function scheduleNotification(uuid: string, scheduledAt: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}/schedule`, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify({ scheduled_at: scheduledAt }),
            });

            const data = await response.json();

            if (data.success) {
                await fetchNotification(uuid);
            }

            return data;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function cancelNotification(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${uuid}/cancel`, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            if (data.success) {
                await fetchNotification(uuid);
            }

            return data;
        } catch (error) {
            console.error('Error cancelling notification:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchStatistics() {
        try {
            const response = await fetch(`${API_URL}/statistics`, {
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            if (data.success && data.data) {
                statistics.value = data.data;
            }

            return data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }

    async function fetchLists(params: any = {}) {
        loading.value = true;
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await fetch(`${API_URL}/lists?${queryParams}`, {
                headers: sharedGetAuthHeaders(),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                lists.value = data.data;
            }

            return data;
        } catch (error) {
            console.error('Error fetching lists:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchList(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}`, {
                headers: sharedGetAuthHeaders(),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                const index = lists.value.findIndex(l => l.uuid === uuid);
                if (index !== -1) {
                    lists.value[index] = data.data;
                }
            }

            return data;
        } catch (error) {
            console.error('Error fetching list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function createList(listData: any) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists`, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify(listData),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                lists.value.unshift(data.data);
            }

            return data;
        } catch (error) {
            console.error('Error creating list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function updateList(uuid: string, listData: any) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}`, {
                method: 'PUT',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify(listData),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                const index = lists.value.findIndex(l => l.uuid === uuid);
                if (index !== -1) {
                    lists.value[index] = data.data;
                }
            }

            return data;
        } catch (error) {
            console.error('Error updating list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function deleteList(uuid: string) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}`, {
                method: 'DELETE',
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            if (data.success) {
                lists.value = lists.value.filter(l => l.uuid !== uuid);
            }

            return data;
        } catch (error) {
            console.error('Error deleting list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchListUsers(uuid: string) {
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}/users`, {
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching list users:', error);
            throw error;
        }
    }

    async function addUsersToList(uuid: string, userIds: string[]) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}/users`, {
                method: 'POST',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify({ user_ids: userIds }),
            });

            const data = await response.json();

            if (data.success) {
                await fetchList(uuid);
            }

            return data;
        } catch (error) {
            console.error('Error adding users to list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function removeUsersFromList(uuid: string, userIds: string[]) {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/lists/${uuid}/users`, {
                method: 'DELETE',
                headers: sharedGetAuthHeaders(),
                body: JSON.stringify({ user_ids: userIds }),
            });

            const data = await response.json();

            if (data.success) {
                await fetchList(uuid);
            }

            return data;
        } catch (error) {
            console.error('Error removing users from list:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchDeliveries(params: any = {}) {
        loading.value = true;
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await fetch(`${API_URL}/deliveries?${queryParams}`, {
                headers: sharedGetAuthHeaders(),
            });

            const data: any = await response.json();

            if (data.success && data.data) {
                deliveries.value = data.data;
            }

            return data;
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function fetchDeliveryStatistics(notificationId: number) {
        try {
            const response = await fetch(`${API_URL}/deliveries/${notificationId}/statistics`, {
                headers: sharedGetAuthHeaders(),
            });

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching delivery statistics:', error);
            throw error;
        }
    }

    return {
        // State
        notifications,
        currentNotification,
        lists,
        deliveries,
        statistics,
        loading,
        pagination,

        // Getters
        draftNotifications,
        scheduledNotifications,
        sentNotifications,
        failedNotifications,
        dynamicLists,
        manualLists,

        // Actions
        fetchNotifications,
        fetchNotification,
        createNotification,
        updateNotification,
        deleteNotification,
        sendNotification,
        scheduleNotification,
        cancelNotification,
        fetchStatistics,
        fetchLists,
        fetchList,
        createList,
        updateList,
        deleteList,
        fetchListUsers,
        addUsersToList,
        removeUsersFromList,
        fetchDeliveries,
        fetchDeliveryStatistics,
    };
});
