import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface Translation {
    key: string;
    value: string;
}

export const useTranslationsStore = defineStore('translations', () => {
    const authStore = useAuthStore();
    const API_BASE_URL = config.translations_url;

    // State
    const translations = ref<Record<string, any>>({});
    const keys = ref<string[]>([]);
    const currentLanguage = ref<string>('en');
    const loading = ref(false);
    const error = ref<string | null>(null);

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
    async function fetchTranslations(languageCode: string) {
        loading.value = true;
        error.value = null;
        currentLanguage.value = languageCode;
        try {
            const response = await fetch(`${API_BASE_URL}/${languageCode}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // The API returns: { success: true, data: { language: {...}, translations: {...}, last_modified: ... } }
            if (result.success && result.data && result.data.translations) {
                translations.value = result.data.translations;
            } else {
                translations.value = {};
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching translations:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchKeys(languageCode: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/${languageCode}/keys`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            keys.value = result.data || result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching translation keys:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function setTranslation(languageCode: string, key: string, value: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/${languageCode}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ key, value })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await fetchTranslations(languageCode); // Refresh
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error setting translation:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function bulkUpdate(languageCode: string, translationsData: Record<string, string>) {
        loading.value = true;
        error.value = null;
        try {
            // Convert object format to array format expected by backend
            const translationsArray = Object.entries(translationsData).map(([key, value]) => ({
                key,
                value
            }));

            const response = await fetch(`${API_BASE_URL}/${languageCode}/bulk`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ translations: translationsArray })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await fetchTranslations(languageCode); // Refresh
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error bulk updating translations:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteTranslation(languageCode: string, key: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/${languageCode}/key/${encodeURIComponent(key)}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok && response.status !== 204) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            await fetchTranslations(languageCode); // Refresh
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting translation:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function syncTranslationKeys() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_BASE_URL}/sync`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error syncing translation keys:', err);
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
        translations,
        keys,
        currentLanguage,
        loading,
        error,
        // Actions
        fetchTranslations,
        fetchKeys,
        setTranslation,
        bulkUpdate,
        deleteTranslation,
        syncTranslationKeys,
        clearError
    };
});
