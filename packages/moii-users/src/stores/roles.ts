import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface Role {
    uuid: string;
    name: string;
    slug: string;
    scope_type: 'system' | 'organisation' | 'app';
    scope_id?: number;
    description?: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
    users_count?: number;
}

export interface Permission {
    uuid: string;
    key: string;
    description?: string;
    category?: string;
    created_at: string;
    updated_at: string;
}

export interface RolesResponse {
    message: string;
    message_code: string;
    roles?: Role[];
    total?: number;
    scope_type?: string;
    scope_id?: number;
}

export interface PermissionsResponse {
    message: string;
    message_code: string;
    permissions?: Permission[];
    total?: number;
}

export interface UserRolesResponse {
    message: string;
    message_code: string;
    user?: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    permissions?: Permission[];
    roles?: Role[];
    total_permissions?: number;
    total_roles?: number;
}

export const useRolesStore = defineStore('roles', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const roles = ref<Role[]>([]);
    const permissions = ref<Permission[]>([]);
    const userRoles = ref<Role[]>([]);
    const userPermissions = ref<Permission[]>([]);
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

    // Roles Management Actions
    async function getAllRoles() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles`, {
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

            const data: RolesResponse = await response.json();
            roles.value = data.roles || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching roles:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createRole(roleData: Partial<Role>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(roleData)
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
            console.error('Error creating role:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateRole(roleUuid: string, roleData: Partial<Role>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles/${roleUuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(roleData)
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
            console.error('Error updating role:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteRole(roleUuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles/${roleUuid}`, {
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
            console.error('Error deleting role:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Permissions Management Actions
    async function getAllPermissions() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/permissions`, {
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

            const data: PermissionsResponse = await response.json();
            permissions.value = data.permissions || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching permissions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createPermission(permissionData: Partial<Permission>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/permissions`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(permissionData)
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
            console.error('Error creating permission:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updatePermission(permissionUuid: string, permissionData: Partial<Permission>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/permissions/${permissionUuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(permissionData)
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
            console.error('Error updating permission:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deletePermission(permissionUuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/permissions/${permissionUuid}`, {
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
            console.error('Error deleting permission:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Role-Permission Assignment Actions
    async function assignPermissionsToRole(roleUuid: string, permissionKeys: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles/${roleUuid}/permissions`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ permissions: permissionKeys })
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
            // Update role in local state
            if (data.role) {
                const index = roles.value.findIndex(r => r.uuid === roleUuid);
                if (index !== -1) {
                    roles.value[index] = data.role;
                }
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error assigning permissions to role:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function unassignPermissionsFromRole(roleUuid: string, permissionKeys: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/roles/${roleUuid}/permissions`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ permissions: permissionKeys })
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
            // Update role in local state
            if (data.role) {
                const index = roles.value.findIndex(r => r.uuid === roleUuid);
                if (index !== -1) {
                    roles.value[index] = data.role;
                }
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error unassigning permissions from role:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // User Role Assignment Actions
    async function assignRolesToUser(userUuid: string, roleIds: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${userUuid}/roles`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ roles: roleIds })
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
            console.error('Error assigning roles to user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function unassignRolesFromUser(userUuid: string, roleIds: string[]) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${userUuid}/roles`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ roles: roleIds })
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
            console.error('Error unassigning roles from user:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Get User Permissions and Roles
    async function getUserPermissions() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/user-permissions`, {
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

            const data: UserRolesResponse = await response.json();
            userRoles.value = data.roles || [];
            userPermissions.value = data.permissions || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user permissions:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Get specific user's roles and permissions
    async function getUserRolesAndPermissions(userUuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/users/${userUuid}/roles`, {
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

            const data = await response.json();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching user roles and permissions:', err);
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
        roles,
        permissions,
        userRoles,
        userPermissions,
        loading,
        error,

        // Actions
        getAllRoles,
        createRole,
        updateRole,
        deleteRole,
        getAllPermissions,
        createPermission,
        updatePermission,
        deletePermission,
        assignPermissionsToRole,
        unassignPermissionsFromRole,
        assignRolesToUser,
        unassignRolesFromUser,
        getUserPermissions,
        getUserRolesAndPermissions,
        clearError
    };
});
