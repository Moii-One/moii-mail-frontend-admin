import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface UserSetting {
    uuid: string;
    key: string;
    value: any;
    type: 'string' | 'integer' | 'boolean' | 'float' | 'json' | 'array';
    is_encrypted: boolean;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateUserSettingData {
    key: string;
    value: any;
    type?: 'string' | 'integer' | 'boolean' | 'float' | 'json' | 'array';
    is_encrypted?: boolean;
    description?: string | null;
}

export interface UserSettingsResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const useUserSettingsStore = defineStore('userSettings', () => {
    const authStore = useAuthStore();
    const API_BASE_URL = config.api_url;

    // State
    const settings = ref<UserSetting[]>([]);
    const currentSetting = ref<UserSetting | null>(null);
    const selectedUserId = ref<string | null>(null); // Changed to string for UUID
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const totalSettings = computed(() => settings.value.length);

    const stringSettings = computed(() =>
        settings.value.filter(s => s.type === 'string').length
    );

    const jsonSettings = computed(() =>
        settings.value.filter(s => s.type === 'json' || s.type === 'array').length
    );

    const encryptedSettings = computed(() =>
        settings.value.filter(s => s.is_encrypted).length
    );

    const getSettingByKey = (key: string) => {
        return settings.value.find(s => s.key === key);
    };

    const getSettingByUuid = (uuid: string) => {
        return settings.value.find(s => s.uuid === uuid);
    };

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const shared = sharedGetAuthHeaders();
        if (shared['Authorization']) {
            headers['Authorization'] = shared['Authorization'];
        }

        return headers;
    };

    /**
     * Fetch all settings for the authenticated user
     * Note: Currently the API only returns settings for authenticated user
     * User selection would require admin endpoint modification
     */
    async function fetchAllSettings(userId?: string) {
        loading.value = true;
        error.value = null;

        // Store selected user ID for reference
        if (userId) {
            selectedUserId.value = userId;
        }

        try {
            const url = userId 
                ? `${API_BASE_URL}?user_uuid=${encodeURIComponent(userId)}`
                : API_BASE_URL;
                
            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Handle different API response formats
            if (result.success && result.data) {
                // Check if data is already an array of settings
                if (Array.isArray(result.data)) {
                    settings.value = result.data;
                } else {
                    // Convert key-value object to array of settings
                    settings.value = Object.entries(result.data).map(([key, value]) => ({
                        uuid: `temp-${key}`, // Temporary until we have real UUIDs
                        key,
                        value,
                        type: typeof value === 'object' ? 'json' : typeof value as any,
                        is_encrypted: false,
                        description: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }));
                }
            } else {
                settings.value = [];
            }

            return result;
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
            const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(key)}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success && result.data) {
                currentSetting.value = result.data as UserSetting;
            }
            return result.data?.value || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchSettingByUuid(uuid: string) {
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
            if (result.success && result.data) {
                const setting = result.data as UserSetting;
                currentSetting.value = setting;
                
                // Update in the list if exists
                const index = settings.value.findIndex(s => s.uuid === uuid);
                if (index !== -1) {
                    settings.value = [
                        ...settings.value.slice(0, index),
                        setting,
                        ...settings.value.slice(index + 1)
                    ];
                }
            }
            return result.data || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user setting by UUID:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function setSetting(key: string, value: any, type?: string, isEncrypted?: boolean, description?: string | null, applyToAll?: boolean) {
        loading.value = true;
        error.value = null;
        try {
            const payload: any = {
                key,
                value,
                type: type || 'string',
                is_encrypted: isEncrypted || false
            };
            
            // Only include description if it's not null/undefined
            if (description !== undefined && description !== null) {
                payload.description = description;
            }
            
            // Add user_uuid if a user is selected (admin mode)
            if (selectedUserId.value) {
                payload.user_uuid = selectedUserId.value;
            }
            
            // Add apply_to_all flag if specified
            if (applyToAll) {
                payload.apply_to_all = true;
            }
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Refresh the list after creating/updating (use selected user if set)
            await fetchAllSettings(selectedUserId.value || undefined);
            
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error setting user setting:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createSetting(settingData: CreateUserSettingData & { apply_to_all?: boolean }) {
        return await setSetting(
            settingData.key,
            settingData.value,
            settingData.type,
            settingData.is_encrypted,
            settingData.description,
            settingData.apply_to_all
        );
    }

    async function updateSetting(uuid: string, settingData: CreateUserSettingData & { apply_to_all?: boolean }) {
        // Since the API uses upsert (same endpoint for create/update), 
        // we just call setSetting with the key
        return await setSetting(
            settingData.key,
            settingData.value,
            settingData.type,
            settingData.is_encrypted,
            settingData.description,
            settingData.apply_to_all
        );
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
            const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(key)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok && response.status !== 204) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Remove from local state
            settings.value = settings.value.filter(s => s.key !== key);
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

            // Remove from local state
            settings.value = settings.value.filter(s => s.uuid !== uuid);
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
            settings.value = [];
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
        currentSetting,
        selectedUserId,
        loading,
        error,

        // Getters
        totalSettings,
        stringSettings,
        jsonSettings,
        encryptedSettings,
        getSettingByKey,
        getSettingByUuid,

        // Actions
        fetchAllSettings,
        getSetting,
        fetchSettingByUuid,
        setSetting,
        createSetting,
        updateSetting,
        updateBulkSettings,
        deleteSetting,
        deleteSettingByUuid,
        deleteAllSettings,
        getSettingsByPrefix,
        clearError
    };
});
