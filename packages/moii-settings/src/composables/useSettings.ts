import { ref } from 'vue';
import config from '../../config.json';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';

export interface Setting {
    id?: number;
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    group?: string | null;
    description?: string | null;
    is_public: boolean;
    created_at?: string;
    updated_at?: string;
}

export function useSettings() {
    const API_URL = config.api_url;
    const authStore = useAuthStore();
    const settings = ref<Setting[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

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

    const fetchSettings = async () => {
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
        } finally {
            loading.value = false;
        }
    };

    const createSetting = async (setting: Omit<Setting, 'id' | 'created_at' | 'updated_at'>) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(setting)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
    };

    const updateSetting = async (id: number, setting: Partial<Setting>) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(setting)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
    };

    const deleteSetting = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchSettings(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getSettingByKey = async (key: string) => {
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
    };

    return {
        settings,
        loading,
        error,
        fetchSettings,
        createSetting,
        updateSetting,
        deleteSetting,
        getSettingByKey
    };
}
