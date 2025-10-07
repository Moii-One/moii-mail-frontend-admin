import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface Setting {
    id?: number;
    uuid?: string;
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    group?: string | null;
    description?: string | null;
    is_public: boolean;
    created_at?: string;
    updated_at?: string;
}

export const useSettingsStore = defineStore('settings', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const settings = ref<Setting[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const publicSettings = computed(() => 
        settings.value.filter(s => s.is_public)
    );

    const settingsByGroup = computed(() => {
        const groups: Record<string, Setting[]> = {};
        settings.value.forEach(setting => {
            const group = setting.group || 'ungrouped';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(setting);
        });
        return groups;
    });

    const getSettingByKey = (key: string) => {
        return settings.value.find(s => s.key === key);
    };

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

    // Actions
    async function fetchSettings() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_URL, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            settings.value = data.data || data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching settings:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createSetting(setting: Omit<Setting, 'id' | 'created_at' | 'updated_at'>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(setting)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await fetchSettings(); // Refresh the list
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateSetting(uuid: string, setting: Partial<Setting>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(setting)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await fetchSettings(); // Refresh the list
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteSetting(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                // Only try to parse JSON if there's content
                if (response.status !== 204) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    } catch (e) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            await fetchSettings(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchSettingByKey(key: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${key}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    return {
        // State
        settings,
        loading,
        error,

        // Getters
        publicSettings,
        settingsByGroup,
        getSettingByKey,

        // Actions
        fetchSettings,
        createSetting,
        updateSetting,
        deleteSetting,
        fetchSettingByKey,
        clearError
    };
});
