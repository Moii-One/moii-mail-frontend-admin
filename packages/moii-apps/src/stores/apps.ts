import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface App {
    id?: number;
    uuid?: string;
    name: string;
    slug: string;
    description?: string | null;
    type: 'web' | 'mobile' | 'api';
    status: 'active' | 'inactive' | 'maintenance';
    config?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
}

export const useAppsStore = defineStore('apps', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const apps = ref<App[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const activeApps = computed(() =>
        apps.value.filter(app => app.status === 'active')
    );

    const appsByType = computed(() => {
        const groups: Record<string, App[]> = {};
        apps.value.forEach(app => {
            const type = app.type;
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(app);
        });
        return groups;
    });

    const getAppByUuid = (uuid: string) => {
        return apps.value.find(app => app.uuid === uuid);
    };

    const getAppBySlug = (slug: string) => {
        return apps.value.find(app => app.slug === slug);
    };

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = authStore.token;
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    };

    // Actions
    const fetchApps = async (params: Record<string, any> = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });

            const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                apps.value = data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch apps');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching apps:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchActiveApps = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/active`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Update only active apps in the main list
                const activeAppsData = data.data;
                apps.value = apps.value.map(app => {
                    const activeApp = activeAppsData.find((a: App) => a.uuid === app.uuid);
                    return activeApp || app;
                });
            } else {
                throw new Error(data.message || 'Failed to fetch active apps');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching active apps:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchAppsByType = async (type: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/type/${type}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch apps by type');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching apps by type:', err);
        } finally {
            loading.value = false;
        }
    };

    const createApp = async (appData: Omit<App, 'id' | 'uuid' | 'created_at' | 'updated_at'>) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(appData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                apps.value.push(data.data);
                await fetchApps(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create app');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error creating app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateApp = async (uuid: string, appData: Partial<App>) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(appData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const index = apps.value.findIndex(app => app.uuid === uuid);
                if (index !== -1) {
                    apps.value[index] = data.data;
                }
                await fetchApps(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to update app');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error updating app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteApp = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                apps.value = apps.value.filter(app => app.uuid !== uuid);
            } else {
                throw new Error(data.message || 'Failed to delete app');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error deleting app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getApp = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch app');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Clear error
    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        apps,
        loading,
        error,

        // Getters
        activeApps,
        appsByType,
        getAppByUuid,
        getAppBySlug,

        // Actions
        fetchApps,
        fetchActiveApps,
        fetchAppsByType,
        createApp,
        updateApp,
        deleteApp,
        getApp,
        clearError,
    };
});
