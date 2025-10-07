import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface Language {
    id?: number;
    code: string;
    name: string;
    native_name?: string;
    is_default?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export const useLanguagesStore = defineStore('languages', () => {
    const authStore = useAuthStore();
    const API_URL = config.languages_url;

    // State
    const languages = ref<Language[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const activeLanguages = computed(() => 
        languages.value.filter(l => l.is_active)
    );

    const defaultLanguage = computed(() => 
        languages.value.find(l => l.is_default)
    );

    const getLanguageByCode = (code: string) => {
        return languages.value.find(l => l.code === code);
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
    async function fetchLanguages() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_URL, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            languages.value = result.data || result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching languages:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createLanguage(language: Omit<Language, 'id' | 'created_at' | 'updated_at'>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(language)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await fetchLanguages(); // Refresh the list
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating language:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateLanguage(id: number, language: Partial<Language>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(language)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await fetchLanguages(); // Refresh the list
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating language:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteLanguage(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status !== 204) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    } catch (e) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
            }

            await fetchLanguages(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting language:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function setDefault(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}/default`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchLanguages(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error setting default language:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function toggleActive(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${id}/toggle-active`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchLanguages(); // Refresh the list
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error toggling language active status:', err);
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
        languages,
        loading,
        error,
        // Getters
        activeLanguages,
        defaultLanguage,
        getLanguageByCode,
        // Actions
        fetchLanguages,
        createLanguage,
        updateLanguage,
        deleteLanguage,
        setDefault,
        toggleActive,
        clearError
    };
});
