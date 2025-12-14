import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface RateLimitStatus {
    identifier: string;
    package: string;
    rateType: string;
    label?: string;
    attempts: number;
    max_attempts: number;
    remaining_attempts: number;
    decay_minutes: number;
    available_at?: string;
    blocked: boolean;
    blocked_until?: string;
}

export interface RateLimitCheck {
    package: string;
    identifier: string;
    status: RateLimitStatus;
}

export interface RateLimitStatusesResponse {
    success: boolean;
    message: string;
    data: {
        statuses: RateLimitStatus[];
    };
}

export const useRateLimitsStore = defineStore('rateLimits', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const rateLimitStatuses = ref<RateLimitStatus[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const blockedRateLimits = computed(() =>
        rateLimitStatuses.value.filter(status => status.blocked)
    );

    const activeRateLimits = computed(() =>
        rateLimitStatuses.value.filter(status => !status.blocked)
    );

    const totalRateLimits = computed(() =>
        rateLimitStatuses.value.length
    );

    const getRateLimitByIdentifier = (identifier: string) => {
        return rateLimitStatuses.value.find(status => status.identifier === identifier);
    };

    // Helper to get auth headers (centralized)
    import('../../../moii-auth/src/utils/http').then(mod => {});
    const getAuthHeaders = () => {
        // @ts-ignore
        const { getAuthHeaders: sharedGetAuthHeaders } = require('../../../moii-auth/src/utils/http');
        const headers = sharedGetAuthHeaders();
        // eslint-disable-next-line no-console
        console.debug('[moii-limiter] getAuthHeaders token present:', !!headers['Authorization']);
        return headers;
    };

    // Actions
    async function fetchRateLimitStatuses(pkg: string, identifier?: string) {
        loading.value = true;
        error.value = null;
        try {
            const requestBody: any = { package: pkg };
            if (identifier) {
                requestBody.identifier = identifier;
            }

            const response = await fetch(`${API_URL}/rate-limit/statuses`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: RateLimitStatusesResponse = await response.json();
            rateLimitStatuses.value = data.data.statuses || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching rate limit statuses:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function checkRateLimit(pkg: string, rateType: string, identifier: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/rate-limit/check`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    package: pkg,
                    rateType: rateType,
                    identifier: identifier
                })
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Transform API response to match expected interface
            const transformedData: RateLimitCheck = {
                package: data.data?.package || '',
                identifier: data.data?.identifier || '',
                status: {
                    identifier: data.data?.identifier || '',
                    package: data.data?.package || '',
                    rateType: data.data?.rateType || '',
                    attempts: data.data?.rate_limit_status?.attempts_made || 0,
                    max_attempts: parseInt(data.data?.rate_limit_status?.max_attempts || '0'),
                    remaining_attempts: data.data?.rate_limit_status?.retries_left || 0,
                    decay_minutes: data.data?.rate_limit_status?.reset_in_minutes || 0,
                    blocked: data.data?.rate_limit_status?.is_rate_limited || false,
                    available_at: undefined,
                    blocked_until: undefined
                }
            };
            return transformedData;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error checking rate limit:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function clearRateLimit(pkg: string, rateType: string, identifier: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/rate-limit/clear`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    package: pkg,
                    rateType: rateType,
                    identifier: identifier
                })
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Refresh all rate limit statuses after clearing
            await fetchAllRateLimitStatuses();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error clearing rate limit:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function clearAllRateLimits(pkg: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/rate-limit/clear-all`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    package: pkg
                })
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Refresh all rate limit statuses after clearing
            await fetchAllRateLimitStatuses();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error clearing all rate limits:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAllRateLimitStatuses() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/rate-limits/all`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: RateLimitStatusesResponse = await response.json();
            rateLimitStatuses.value = data.data.statuses || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching all rate limit statuses:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        // State
        rateLimitStatuses,
        loading,
        error,

        // Getters
        blockedRateLimits,
        activeRateLimits,
        totalRateLimits,
        getRateLimitByIdentifier,

        // Actions
        fetchRateLimitStatuses,
        fetchAllRateLimitStatuses,
        checkRateLimit,
        clearRateLimit,
        clearAllRateLimits
    };
});
