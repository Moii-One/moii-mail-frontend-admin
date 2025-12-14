import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface FeatureFlag {
    key: string;
    name: string;
    enabled: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export const useFeatureFlagsStore = defineStore('featureFlags', () => {
    const authStore = useAuthStore();
    // Use the dedicated /api/features endpoint (remove /settings from path)
    const API_URL = `${config.api_url.replace('/api/settings', '/api/features')}`;

    // State
    const features = ref<Record<string, any>>({});
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const featuresList = computed(() => {
        return Object.entries(features.value).map(([key, data]) => ({
            key,
            name: key.replace('feature.', '').replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            enabled: data.enabled,
            description: data.description,
            uuid: data.uuid,
        }));
    });

    const enabledFeatures = computed(() => 
        featuresList.value.filter(f => f.enabled)
    );

    const disabledFeatures = computed(() => 
        featuresList.value.filter(f => !f.enabled)
    );

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const shared = sharedGetAuthHeaders();
        if (shared['Authorization']) headers['Authorization'] = shared['Authorization'];

        return headers;
    };

    // Actions
    async function fetchFeatures() {
        loading.value = true;
        error.value = null;
        try {
            // Use the dedicated features endpoint
            const response = await fetch(`${API_URL}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.data) {
                // Transform feature settings from moii-features API
                const featureSettings: Record<string, any> = {};
                
                result.data.forEach((setting: any) => {
                    featureSettings[setting.key] = {
                        enabled: setting.enabled,
                        description: setting.description || `Feature flag: ${setting.key}`,
                        uuid: setting.uuid
                    };
                });
                
                features.value = featureSettings;
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching feature flags:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function enableFeature(featureName: string) {
        loading.value = true;
        error.value = null;
        try {
            // Remove feature. prefix if present since the API will handle it
            const key = featureName.replace(/^feature\./, '');
            
            const response = await fetch(`${API_URL}/${key}/enable`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchFeatures(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error enabling feature:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function disableFeature(featureName: string) {
        loading.value = true;
        error.value = null;
        try {
            // Remove feature. prefix if present since the API will handle it
            const key = featureName.replace(/^feature\./, '');
            
            const response = await fetch(`${API_URL}/${key}/disable`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchFeatures(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error disabling feature:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createFeature(featureName: string, description: string, enabled: boolean = true) {
        loading.value = true;
        error.value = null;
        try {
            // Remove feature. prefix if present since the API will add it
            const key = featureName.replace(/^feature\./, '');
            
            // Use the dedicated features create endpoint
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    key: key,
                    description: description,
                    enabled: enabled
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchFeatures(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating feature:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateFeature(featureName: string, description: string, enabled?: boolean) {
        loading.value = true;
        error.value = null;
        try {
            // Remove feature. prefix if present since the API will handle it
            const key = featureName.replace(/^feature\./, '');
            
            // Use the dedicated features update endpoint
            const response = await fetch(`${API_URL}/${key}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    description: description,
                    ...(enabled !== undefined && { enabled })
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchFeatures(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating feature:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteFeature(featureName: string) {
        loading.value = true;
        error.value = null;
        try {
            // Remove feature. prefix if present since the API will handle it
            const key = featureName.replace(/^feature\./, '');
            
            // Use the dedicated features delete endpoint
            const response = await fetch(`${API_URL}/${key}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('You do not have permission to perform this action.');
                }
                if (response.status !== 204) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    } catch (e) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
            }

            await fetchFeatures(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting feature:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function toggleFeature(featureName: string, enabled: boolean) {
        const key = featureName.startsWith('feature.') ? featureName : `feature.${featureName}`;
        
        // Optimistic update
        const originalEnabled = features.value[key]?.enabled;
        if (features.value[key]) {
            features.value[key].enabled = enabled;
        }
        
        try {
            if (enabled) {
                await enableFeature(featureName);
            } else {
                await disableFeature(featureName);
            }
        } catch (err) {
            // Revert on error
            if (features.value[key]) {
                features.value[key].enabled = originalEnabled;
            }
            throw err;
        }
    }

    function isEnabled(featureName: string): boolean {
        const key = featureName.startsWith('feature.') ? featureName : `feature.${featureName}`;
        return features.value[key]?.enabled || false;
    }

    function clearError() {
        error.value = null;
    }

    return {
        // State
        features,
        loading,
        error,
        // Getters
        featuresList,
        enabledFeatures,
        disabledFeatures,
        // Actions
        fetchFeatures,
        enableFeature,
        disableFeature,
        createFeature,
        updateFeature,
        deleteFeature,
        toggleFeature,
        isEnabled,
        clearError,
    };
});
