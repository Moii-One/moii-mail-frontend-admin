import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface NotificationRecipient {
    id: number;
    notification_id: number;
    type: 'user' | 'list' | 'external';
    user_id?: number;
    list_id?: number;
    email?: string;
    phone?: string;
    push_tokens?: string[];
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface NotificationDelivery {
    id: number;
    notification_id: number;
    recipient_id: number;
    channel: 'email' | 'sms' | 'push';
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'opened' | 'clicked';
    sent_at: string | null;
    delivered_at: string | null;
    opened_at: string | null;
    clicked_at: string | null;
    failed_at: string | null;
    error_message: string | null;
    provider_message_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
    channels: ('email' | 'sms' | 'push')[];
    scheduled_at: string | null;
    sent_at: string | null;
    settings?: Record<string, any>;
    template_data?: Record<string, any>;
    created_by: number;
    total_recipients: number;
    delivered_count: number;
    failed_count: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    recipients?: NotificationRecipient[];
    deliveries?: NotificationDelivery[];
}

export interface CreateNotificationData {
    title: string;
    content: string;
    excerpt?: string;
    status?: 'draft' | 'scheduled';
    channels: ('email' | 'sms' | 'push')[];
    scheduled_at?: string;
    settings?: Record<string, any>;
    template_data?: Record<string, any>;
    recipients: {
        type: 'user' | 'list' | 'external';
        user_id?: number;
        list_id?: number;
        email?: string;
        phone?: string;
        push_tokens?: string[];
    }[];
}

export interface UpdateNotificationData {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: 'draft' | 'scheduled';
    channels?: ('email' | 'sms' | 'push')[];
    scheduled_at?: string;
    settings?: Record<string, any>;
    template_data?: Record<string, any>;
    recipients?: {
        type: 'user' | 'list' | 'external';
        user_id?: number;
        list_id?: number;
        email?: string;
        phone?: string;
        push_tokens?: string[];
    }[];
}

export interface NotificationsResponse {
    success: boolean;
    message?: string;
    data?: {
        data: Notification[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    } | Notification;
}

export interface NotificationStatistics {
    total_notifications: number;
    draft_notifications: number;
    scheduled_notifications: number;
    sending_notifications: number;
    sent_notifications: number;
    failed_notifications: number;
    cancelled_notifications: number;
    total_recipients: number;
    total_deliveries: number;
    delivered_count: number;
    failed_deliveries: number;
    opened_count: number;
    clicked_count: number;
    open_rate: number;
    click_rate: number;
}

export const useNotificationsStore = defineStore('notifications', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const notifications = ref<Notification[]>([]);
    const currentNotification = ref<Notification | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
    });
    const statistics = ref<NotificationStatistics | null>(null);

    // Getters
    const hasNotifications = computed(() => notifications.value.length > 0);
    const draftNotifications = computed(() => 
        notifications.value.filter(n => n.status === 'draft')
    );
    const scheduledNotifications = computed(() => 
        notifications.value.filter(n => n.status === 'scheduled')
    );
    const sendingNotifications = computed(() => 
        notifications.value.filter(n => n.status === 'sending')
    );
    const sentNotifications = computed(() => 
        notifications.value.filter(n => n.status === 'sent')
    );
    const failedNotifications = computed(() => 
        notifications.value.filter(n => n.status === 'failed')
    );

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (authStore.token) {
            headers['Authorization'] = `Bearer ${authStore.token}`;
        }

        return headers;
    };

    // Helper function to make API requests
    const makeRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    };

    // Actions
    const fetchNotifications = async (filters: any = {}, page: number = 1) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: pagination.value.per_page.toString(),
                ...filters,
            });

            const response: NotificationsResponse = await makeRequest(`?${params}`);
            
            if (response.success && response.data && 'data' in response.data) {
                notifications.value = response.data.data;
                pagination.value = {
                    current_page: response.data.current_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    last_page: response.data.last_page,
                };
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch notifications';
            console.error('Error fetching notifications:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchNotification = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}`);
            
            if (response.success && response.data && !('data' in response.data)) {
                currentNotification.value = response.data as Notification;
                return response.data as Notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch notification';
            console.error('Error fetching notification:', err);
        } finally {
            loading.value = false;
        }
    };

    const createNotification = async (data: CreateNotificationData) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest('', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (response.success && response.data && !('data' in response.data)) {
                const notification = response.data as Notification;
                notifications.value.unshift(notification);
                return notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create notification';
            console.error('Error creating notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateNotification = async (id: number, data: UpdateNotificationData) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (response.success && response.data && !('data' in response.data)) {
                const notification = response.data as Notification;
                const index = notifications.value.findIndex(n => n.id === id);
                if (index !== -1) {
                    notifications.value[index] = notification;
                }
                if (currentNotification.value?.id === id) {
                    currentNotification.value = notification;
                }
                return notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update notification';
            console.error('Error updating notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteNotification = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}`, {
                method: 'DELETE',
            });

            if (response.success) {
                notifications.value = notifications.value.filter(n => n.id !== id);
                if (currentNotification.value?.id === id) {
                    currentNotification.value = null;
                }
                return true;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete notification';
            console.error('Error deleting notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const scheduleNotification = async (id: number, scheduledAt: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}/schedule`, {
                method: 'POST',
                body: JSON.stringify({ scheduled_at: scheduledAt }),
            });

            if (response.success && response.data && !('data' in response.data)) {
                const notification = response.data as Notification;
                const index = notifications.value.findIndex(n => n.id === id);
                if (index !== -1) {
                    notifications.value[index] = notification;
                }
                if (currentNotification.value?.id === id) {
                    currentNotification.value = notification;
                }
                return notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to schedule notification';
            console.error('Error scheduling notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const sendNotification = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}/send`, {
                method: 'POST',
            });

            if (response.success && response.data && !('data' in response.data)) {
                const notification = response.data as Notification;
                const index = notifications.value.findIndex(n => n.id === id);
                if (index !== -1) {
                    notifications.value[index] = notification;
                }
                if (currentNotification.value?.id === id) {
                    currentNotification.value = notification;
                }
                return notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to send notification';
            console.error('Error sending notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const cancelNotification = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: NotificationsResponse = await makeRequest(`/${id}/cancel`, {
                method: 'POST',
            });

            if (response.success && response.data && !('data' in response.data)) {
                const notification = response.data as Notification;
                const index = notifications.value.findIndex(n => n.id === id);
                if (index !== -1) {
                    notifications.value[index] = notification;
                }
                if (currentNotification.value?.id === id) {
                    currentNotification.value = notification;
                }
                return notification;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to cancel notification';
            console.error('Error canceling notification:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchStatistics = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await makeRequest('/statistics');
            
            if (response.success && response.data) {
                statistics.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch statistics';
            console.error('Error fetching statistics:', err);
        } finally {
            loading.value = false;
        }
    };

    // Reset store
    const reset = () => {
        notifications.value = [];
        currentNotification.value = null;
        loading.value = false;
        error.value = null;
        statistics.value = null;
        pagination.value = {
            current_page: 1,
            per_page: 15,
            total: 0,
            last_page: 1,
        };
    };

    return {
        // State
        notifications,
        currentNotification,
        loading,
        error,
        pagination,
        statistics,
        
        // Computed
        hasNotifications,
        draftNotifications,
        scheduledNotifications,
        sentNotifications,
        
        // Actions
        fetchNotifications,
        fetchNotification,
        createNotification,
        updateNotification,
        deleteNotification,
        scheduleNotification,
        sendNotification,
        cancelNotification,
        fetchStatistics,
        reset,
    };
});
