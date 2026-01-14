import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders, fetchWithAuth } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface User {
    id: number;
    uuid: string;
    name: string;
    email: string;
    email_verified_at?: string;
    company?: string;
    phone?: string;
    avatar?: string;
    status: 'active' | 'inactive' | 'suspended';
    is_locked: boolean;
    failed_login_attempts: number;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
    two_factor_enabled: boolean;
    roles?: Role[];
    permissions?: Permission[];
}

export interface Role {
    uuid: string;
    name: string;
    display_name: string;
    description?: string;
}

export interface Permission {
    uuid: string;
    name: string;
    display_name: string;
    description?: string;
}

export interface UserSession {
    uuid: string;
    user_agent: string;
    ip_address: string;
    last_activity: string;
    created_at: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    company?: string;
    phone?: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'suspended';
}

export interface UsersResponse {
    success: boolean;
    message: string;
    message_code: string;
    users?: User[];
    user?: User;
    pagination?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface UserSessionsResponse {
    success: boolean;
    message: string;
    message_code: string;
    sessions?: UserSession[];
}

export interface TwoFactorStatus {
    enabled: boolean;
    qr_code_url?: string;
    secret?: string;
}

export interface TwoFactorStatusResponse {
    success: boolean;
    message: string;
    message_code: string;
    two_factor?: TwoFactorStatus;
}

export const useUsersStore = defineStore('users', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const users = ref<User[]>([]);
    const currentUser = ref<User | null>(null);
    const userSessions = ref<UserSession[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
    });

    // Getters
    const activeUsers = computed(() =>
        users.value.filter(user => user.status === 'active')
    );

    const inactiveUsers = computed(() =>
        users.value.filter(user => user.status === 'inactive')
    );

    const suspendedUsers = computed(() =>
        users.value.filter(user => user.status === 'suspended')
    );

    const lockedUsers = computed(() =>
        users.value.filter(user => user.is_locked)
    );

    const totalUsers = computed(() =>
        users.value.length
    );

    const getUserByUuid = (uuid: string) => {
        return users.value.find(user => user.uuid === uuid);
    };

    // Helper to get auth headers (centralized)
    const getAuthHeaders = () => {
        return sharedGetAuthHeaders();
    };

    // Actions
    async function fetchUsers(filters: {
        search?: string;
        email?: string;
        company?: string;
        tenant_id?: string;
        app_id?: string;
        page?: number;
        per_page?: number;
    } = {}) {
        loading.value = true;
        error.value = null;
        try {
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.email) queryParams.append('email', filters.email);
            if (filters.company) queryParams.append('company', filters.company);
            if (filters.tenant_id) queryParams.append('tenant_id', filters.tenant_id);
            if (filters.app_id) queryParams.append('app_id', filters.app_id);
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.per_page) queryParams.append('per_page', filters.per_page.toString());

            const response = await fetchWithAuth(`${API_URL}/users?${queryParams}`, {
                method: 'GET',
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

            const data: any = await response.json();
            // Handle both response formats: {users: [...]} and {data: [...], meta: {...}}
            users.value = data.users || data.data || [];
            if (data.pagination) {
                pagination.value = data.pagination;
            } else if (data.meta) {
                // Map 'meta' to 'pagination' format
                pagination.value = {
                    current_page: data.meta.current_page,
                    per_page: data.meta.per_page,
                    total: data.meta.total,
                    last_page: data.meta.last_page
                };
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching users:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createUser(userData: CreateUserData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData)
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

            const data: UsersResponse = await response.json();
            // Refresh users list after creation
            await fetchUsers();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateUser(uuid: string, userData: UpdateUserData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData)
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

            const data: UsersResponse = await response.json();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteUser(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}`, {
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
            // Remove user from local state
            users.value = users.value.filter(user => user.uuid !== uuid);
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateUserStatus(uuid: string, status: 'active' | 'inactive' | 'suspended') {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
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
            // Update user status in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.status = status;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating user status:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function lockAccount(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/lock`, {
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
            // Update user lock status in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.is_locked = true;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error locking account:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function unlockAccount(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/unlock`, {
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
            // Update user lock status in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.is_locked = false;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error unlocking account:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function resetFailedLoginAttempts(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/reset-attempts`, {
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
            // Update user failed attempts in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.failed_login_attempts = 0;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error resetting failed login attempts:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function terminateAllUserSessions(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/sessions`, {
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
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error terminating user sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getUserSessions(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/sessions`, {
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

            const data: UserSessionsResponse = await response.json();
            userSessions.value = data.sessions || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user sessions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function assignRolesToUser(uuid: string, roleUuids: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/roles/assign`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ roles: roleUuids })
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
            // Refresh user data to get updated roles
            await fetchUsers();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error assigning roles to user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function unassignRolesFromUser(uuid: string, roleUuids: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/roles/unassign`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ roles: roleUuids })
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
            // Refresh user data to get updated roles
            await fetchUsers();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error unassigning roles from user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function enableUser2FA(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/2fa/enable`, {
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
            // Update user 2FA status in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.two_factor_enabled = true;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error enabling 2FA for user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function disableUser2FA(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/2fa/disable`, {
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
            // Update user 2FA status in local state
            const user = users.value.find(u => u.uuid === uuid);
            if (user) {
                user.two_factor_enabled = false;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error disabling 2FA for user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getUser2FAStatus(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/2fa/status`, {
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

            const data: TwoFactorStatusResponse = await response.json();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user 2FA status:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function clearUser2FACodes(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${uuid}/2fa/clear-codes`, {
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
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error clearing user 2FA codes:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    function setCurrentUser(user: User | null) {
        currentUser.value = user;
    }

    return {
        // State
        users,
        currentUser,
        userSessions,
        loading,
        error,
        pagination,

        // Getters
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        lockedUsers,
        totalUsers,
        getUserByUuid,

        // Actions
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        updateUserStatus,
        lockAccount,
        unlockAccount,
        resetFailedLoginAttempts,
        terminateAllUserSessions,
        getUserSessions,
        assignRolesToUser,
        unassignRolesFromUser,
        enableUser2FA,
        disableUser2FA,
        getUser2FAStatus,
        clearUser2FACodes,
        clearError,
        setCurrentUser
    };
});
