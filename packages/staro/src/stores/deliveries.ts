import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

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
    recipient?: {
        id: number;
        type: 'user' | 'list' | 'external';
        user_id?: number;
        list_id?: number;
        email?: string;
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    notification?: {
        id: number;
        title: string;
        channels: string[];
    };
}

export interface DeliveryStatistics {
    notification_id: number;
    total_deliveries: number;
    by_channel: {
        email: number;
        sms: number;
        push: number;
    };
    by_status: {
        pending: number;
        sent: number;
        delivered: number;
        failed: number;
        bounced: number;
        opened: number;
        clicked: number;
    };
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
}

export interface DeliveriesResponse {
    success: boolean;
    message?: string;
    data?: {
        data: NotificationDelivery[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    } | DeliveryStatistics;
}

export const useNotificationDeliveriesStore = defineStore('notificationDeliveries', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const deliveries = ref<NotificationDelivery[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
    });
    const statistics = ref<DeliveryStatistics | null>(null);

    // Getters
    const hasDeliveries = computed(() => deliveries.value.length > 0);
    const successfulDeliveries = computed(() => 
        deliveries.value.filter(d => ['sent', 'delivered', 'opened', 'clicked'].includes(d.status))
    );
    const failedDeliveries = computed(() => 
        deliveries.value.filter(d => ['failed', 'bounced'].includes(d.status))
    );
    const pendingDeliveries = computed(() => 
        deliveries.value.filter(d => d.status === 'pending')
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
        const url = `${API_URL}/deliveries${endpoint}`;
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
    const fetchDeliveries = async (filters: any = {}, page: number = 1) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: pagination.value.per_page.toString(),
                ...filters,
            });

            const response: DeliveriesResponse = await makeRequest(`?${params}`);
            
            if (response.success && response.data && 'data' in response.data) {
                deliveries.value = response.data.data;
                pagination.value = {
                    current_page: response.data.current_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    last_page: response.data.last_page,
                };
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch deliveries';
            console.error('Error fetching deliveries:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchNotificationStatistics = async (notificationId: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: DeliveriesResponse = await makeRequest(`/${notificationId}/statistics`);
            
            if (response.success && response.data && !('data' in response.data)) {
                statistics.value = response.data as DeliveryStatistics;
                return response.data as DeliveryStatistics;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch notification statistics';
            console.error('Error fetching notification statistics:', err);
        } finally {
            loading.value = false;
        }
    };

    // Reset store
    const reset = () => {
        deliveries.value = [];
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
        deliveries,
        loading,
        error,
        pagination,
        statistics,
        
        // Computed
        hasDeliveries,
        successfulDeliveries,
        failedDeliveries,
        pendingDeliveries,
        
        // Actions
        fetchDeliveries,
        fetchNotificationStatistics,
        reset,
    };
});
