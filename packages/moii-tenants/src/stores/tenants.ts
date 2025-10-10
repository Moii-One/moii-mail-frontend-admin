import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import config from '../../config.json';

export interface Tenant {
    id?: number;
    uuid?: string;
    name: string;
    slug: string;
    description?: string | null;
    status: 'active' | 'inactive' | 'blocked';
    config?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
    apps?: App[];
}

export interface App {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    type: 'web' | 'mobile' | 'api';
    status: 'active' | 'inactive' | 'maintenance';
    config?: Record<string, any> | null;
    created_at?: string;
    updated_at?: string;
}

export const useTenantsStore = defineStore('tenants', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const tenants = ref<Tenant[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const apps = ref<App[]>([]);

    // Getters
    const activeTenants = computed(() =>
        tenants.value.filter(tenant => tenant.status === 'active')
    );

    const tenantsByStatus = computed(() => {
        const groups: Record<string, Tenant[]> = {};
        tenants.value.forEach(tenant => {
            const status = tenant.status;
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(tenant);
        });
        return groups;
    });

    const getTenantByUuid = (uuid: string) => {
        return tenants.value.find(tenant => tenant.uuid === uuid);
    };

    const getTenantBySlug = (slug: string) => {
        return tenants.value.find(tenant => tenant.slug === slug);
    };

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = authStore.token;
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    };

    // Actions
    const fetchTenants = async (params: Record<string, any> = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([ key, value ]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });

            const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                tenants.value = data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch tenants');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching tenants:', err);
        } finally {
            loading.value = false;
        }
    };

    const fetchActiveTenants = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/active`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Update only active tenants in the main list
                const activeTenantsData = data.data;
                tenants.value = tenants.value.map(tenant => {
                    const activeTenant = activeTenantsData.find((t: Tenant) => t.uuid === tenant.uuid);
                    return activeTenant || tenant;
                });
            } else {
                throw new Error(data.message || 'Failed to fetch active tenants');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error fetching active tenants:', err);
        } finally {
            loading.value = false;
        }
    };

    const createTenant = async (tenantData: Omit<Tenant, 'id' | 'uuid' | 'created_at' | 'updated_at'>) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(tenantData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                tenants.value.push(data.data);
                await fetchTenants(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error creating tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateTenant = async (uuid: string, tenantData: Partial<Tenant>) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(tenantData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const index = tenants.value.findIndex(tenant => tenant.uuid === uuid);
                if (index !== -1) {
                    tenants.value[index] = data.data;
                }
                await fetchTenants(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to update tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error updating tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteTenant = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                tenants.value = tenants.value.filter(tenant => tenant.uuid !== uuid);
            } else {
                throw new Error(data.message || 'Failed to delete tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error deleting tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getTenant = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to get tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error getting tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const duplicateTenant = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}/duplicate`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                tenants.value.push(data.data);
                await fetchTenants(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to duplicate tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error duplicating tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const blockTenant = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}/block`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const index = tenants.value.findIndex(tenant => tenant.uuid === uuid);
                if (index !== -1) {
                    tenants.value[index] = data.data;
                }
                await fetchTenants(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to block tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error blocking tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const unblockTenant = async (uuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${uuid}/unblock`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const index = tenants.value.findIndex(tenant => tenant.uuid === uuid);
                if (index !== -1) {
                    tenants.value[index] = data.data;
                }
                await fetchTenants(); // Refresh the list
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to unblock tenant');
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error unblocking tenant:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const attachApp = async (tenantUuid: string, appUuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${tenantUuid}/attach-app`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ app_uuid: appUuid }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to attach app');
            }

            // Update the tenant in the local state with the returned data
            if (data.data) {
                const tenantIndex = tenants.value.findIndex(t => t.uuid === tenantUuid);
                if (tenantIndex !== -1) {
                    tenants.value[tenantIndex] = data.data;
                }
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error attaching app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const detachApp = async (tenantUuid: string, appUuid: string) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`${API_URL}/${tenantUuid}/detach-app`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ app_uuid: appUuid }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to detach app');
            }

            // Update the tenant in the local state with the returned data
            if (data.data) {
                const tenantIndex = tenants.value.findIndex(t => t.uuid === tenantUuid);
                if (tenantIndex !== -1) {
                    tenants.value[tenantIndex] = data.data;
                }
            }
        } catch (err: any) {
            error.value = err.message;
            console.error('Error detaching app:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Clear error
    const clearError = () => {
        error.value = null;
    };

    // Fetch apps
    const fetchApps = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/apps', {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                apps.value = data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch apps');
            }
        } catch (err: any) {
            console.error('Error fetching apps:', err);
            throw err;
        }
    };

    return {
        // State
        tenants,
        loading,
        error,
        apps,

        // Getters
        activeTenants,
        tenantsByStatus,
        getTenantByUuid,
        getTenantBySlug,

        // Actions
        fetchTenants,
        fetchActiveTenants,
        createTenant,
        updateTenant,
        deleteTenant,
        getTenant,
        duplicateTenant,
        blockTenant,
        unblockTenant,
        attachApp,
        detachApp,
        clearError,
        fetchApps,
    };
});
