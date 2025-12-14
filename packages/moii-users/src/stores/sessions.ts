import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface UserSession {
    uuid: string;
    device_info: string;
    device_name: string;
    device_type: string;
    browser: string;
    os: string;
    ip_address: string;
    location: string;
    last_activity: string;
    last_activity_human: string;
    is_current: boolean;
    created_at: string;
}

export interface SessionsResponse {
    message: string;
    message_code: string;
    user?: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    sessions?: UserSession[];
    total_sessions?: number;
}

export const useSessionsStore = defineStore('sessions', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const sessions = ref<UserSession[]>([]);
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

    // Actions for current user sessions
    async function getActiveSessions() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/sessions`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: SessionsResponse = await response.json();
            sessions.value = data.sessions || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching active sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function terminateSession(sessionUuid: string, userUuid?: string) {
        loading.value = true;
        error.value = null;
        try {
            // Use different endpoint based on whether we have a userUuid (admin view) or not (user view)
            const endpoint = userUuid 
                ? `${API_URL}/users/${userUuid}/sessions/${sessionUuid}`
                : `${API_URL}/sessions/${sessionUuid}`;
                
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Remove session from local state
            sessions.value = sessions.value.filter(session => session.uuid !== sessionUuid);
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error terminating session:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function terminateOtherSessions() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/sessions/terminate-others`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Refresh sessions after terminating others
            await getActiveSessions();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error terminating other sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function terminateAllSessions() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/sessions`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Clear all sessions from local state
            sessions.value = [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error terminating all sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Actions for admin managing user sessions
    async function getUserSessions(userUuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${userUuid}/sessions`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: SessionsResponse = await response.json();
            console.log('API Response data:', data);
            console.log('Sessions from API:', data.sessions);
            sessions.value = data.sessions || [];
            console.log('Sessions stored in state:', sessions.value);
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function terminateAllUserSessions(userUuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${userUuid}/sessions`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Clear sessions from local state
            sessions.value = [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error terminating all user sessions:', err);
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
        sessions,
        loading,
        error,

        // Actions
        getActiveSessions,
        terminateSession,
        terminateOtherSessions,
        terminateAllSessions,
        getUserSessions,
        terminateAllUserSessions,
        clearError
    };
});
