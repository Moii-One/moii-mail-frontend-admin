import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface UserSetting {
    uuid?: string;
    key: string;
    value: any;
    type?: string;
    is_encrypted?: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export const useUserSettingsStore = defineStore('userSettings', () => {
    const authStore = useAuthStore();
    const API_BASE_URL = config.user_settings_url || '/api/user-settings';

    // State
    const settings = ref<Record<string, any>>({});
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        // Use centralized helper
        const shared = sharedGetAuthHeaders();
        if (shared['Authorization']) {
            headers['Authorization'] = shared['Authorization'];
        }

        return headers;
    };

    // Actions
    async function fetchAllSettings() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_BASE_URL, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success && result.data) {
                settings.value = result.data;
            } else {
                settings.value = {};
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user settings:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getSetting(key: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/${key}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data?.value || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getSettingByUuid(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/uuid/${uuid}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user setting by UUID:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function setSetting(key: string, value: any, type?: string, isEncrypted?: boolean, description?: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    key,
                    value,
                    type: type || 'string',
                    is_encrypted: isEncrypted || false,
                    description
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Update local state
            if (result.success && result.data) {
                settings.value[key] = result.data.value;
            }
            
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error setting user setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateBulkSettings(settingsArray: Array<{key: string, value: any, type?: string, is_encrypted?: boolean}>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/bulk`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    settings: settingsArray
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Update local state
            if (result.success && result.data) {
                for (const setting of result.data) {
                    settings.value[setting.key] = setting.value;
                }
            }
            
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating bulk settings:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteSetting(key: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/${key}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok && response.status !== 204) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Update local state
            delete settings.value[key];
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting user setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteSettingByUuid(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/uuid/${uuid}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok && response.status !== 204) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Refresh settings to update local state
            await fetchAllSettings();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting user setting by UUID:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteAllSettings() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok && response.status !== 204) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Clear local state
            settings.value = {};
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting all user settings:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getSettingsByPrefix(prefix: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/prefix/${prefix}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || {};
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user settings by prefix:', err);
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
        // Actions
        fetchAllSettings,
        getSetting,
        getSettingByUuid,
        setSetting,
        updateBulkSettings,
        deleteSetting,
        deleteSettingByUuid,
        deleteAllSettings,
        getSettingsByPrefix,
        clearError
    };
});
