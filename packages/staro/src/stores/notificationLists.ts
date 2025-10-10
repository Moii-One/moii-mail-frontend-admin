import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface NotificationList {
    id: number;
    name: string;
    description: string | null;
    filters: any[] | null;
    is_dynamic: boolean;
    created_by: number;
    users_count: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    users?: User[];
}

export interface CreateListData {
    name: string;
    description?: string;
    is_dynamic: boolean;
    filters?: any[];
    user_ids?: number[];
}

export interface UpdateListData {
    name?: string;
    description?: string;
    is_dynamic?: boolean;
    filters?: any[];
    user_ids?: number[];
}

export interface ListsResponse {
    success: boolean;
    message?: string;
    data?: NotificationList[] | NotificationList;
}

export interface ListUsersResponse {
    success: boolean;
    message?: string;
    data?: User[];
}

export const useNotificationListsStore = defineStore('notificationLists', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const lists = ref<NotificationList[]>([]);
    const currentList = ref<NotificationList | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const hasLists = computed(() => lists.value.length > 0);
    const totalUsers = computed(() => 
        lists.value.reduce((total, list) => total + list.users_count, 0)
    );
    const dynamicLists = computed(() => 
        lists.value.filter(list => list.is_dynamic)
    );
    const manualLists = computed(() => 
        lists.value.filter(list => !list.is_dynamic)
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
        const url = `${API_URL}/lists${endpoint}`;
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
    const fetchLists = async (filters: any = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams(filters);
            const endpoint = params.toString() ? `?${params}` : '';
            
            const response: ListsResponse = await makeRequest(endpoint);
            
            if (response.success && response.data && Array.isArray(response.data)) {
                lists.value = response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch lists';
            console.error('Error fetching lists:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchList = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest(`/${id}`);
            
            if (response.success && response.data && !Array.isArray(response.data)) {
                currentList.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch list';
            console.error('Error fetching list:', err);
        } finally {
            loading.value = false;
        }
    };

    const createList = async (data: CreateListData) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest('', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (response.success && response.data && !Array.isArray(response.data)) {
                lists.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create list';
            console.error('Error creating list:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateList = async (id: number, data: UpdateListData) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest(`/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (response.success && response.data && !Array.isArray(response.data)) {
                const index = lists.value.findIndex(l => l.id === id);
                if (index !== -1) {
                    lists.value[index] = response.data;
                }
                if (currentList.value?.id === id) {
                    currentList.value = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update list';
            console.error('Error updating list:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteList = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest(`/${id}`, {
                method: 'DELETE',
            });

            if (response.success) {
                lists.value = lists.value.filter(l => l.id !== id);
                if (currentList.value?.id === id) {
                    currentList.value = null;
                }
                return true;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete list';
            console.error('Error deleting list:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchListUsers = async (id: number) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListUsersResponse = await makeRequest(`/${id}/users`);
            
            if (response.success && response.data) {
                if (currentList.value?.id === id) {
                    currentList.value.users = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch list users';
            console.error('Error fetching list users:', err);
        } finally {
            loading.value = false;
        }
    };

    const addUsersToList = async (id: number, userIds: number[]) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest(`/${id}/users`, {
                method: 'POST',
                body: JSON.stringify({ user_ids: userIds }),
            });

            if (response.success) {
                // Refresh the list to get updated user count
                await fetchList(id);
                return true;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to add users to list';
            console.error('Error adding users to list:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const removeUsersFromList = async (id: number, userIds: number[]) => {
        loading.value = true;
        error.value = null;

        try {
            const response: ListsResponse = await makeRequest(`/${id}/users`, {
                method: 'DELETE',
                body: JSON.stringify({ user_ids: userIds }),
            });

            if (response.success) {
                // Refresh the list to get updated user count
                await fetchList(id);
                return true;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to remove users from list';
            console.error('Error removing users from list:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Reset store
    const reset = () => {
        lists.value = [];
        currentList.value = null;
        loading.value = false;
        error.value = null;
    };

    return {
        // State
        lists,
        currentList,
        loading,
        error,
        
        // Computed
        hasLists,
        totalUsers,
        dynamicLists,
        manualLists,
        
        // Actions
        fetchLists,
        fetchList,
        createList,
        updateList,
        deleteList,
        fetchListUsers,
        addUsersToList,
        removeUsersFromList,
        reset,
    };
});
