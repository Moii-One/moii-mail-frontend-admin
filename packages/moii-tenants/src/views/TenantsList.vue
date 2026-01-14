<template>
    <div>
        <TenantsHeader
            title="Tenants Management"
            v-model="filters"
            @add="openCreateModal"
        />

        <!-- Tenants Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-users class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ tenantsStore.tenants.length }}</h3>
                        <p class="text-white-dark text-sm">Total Tenants</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-check-circle class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ tenantsStore.activeTenants.length }}</h3>
                        <p class="text-white-dark text-sm">Active Tenants</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-pause-circle class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ tenantsStore.tenantsByStatus.inactive?.length || 0 }}</h3>
                        <p class="text-white-dark text-sm">Inactive Tenants</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-x-circle class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ tenantsStore.tenantsByStatus.blocked?.length || 0 }}</h3>
                        <p class="text-white-dark text-sm">Blocked Tenants</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tenants Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="tenantsStore.tenants.length > 0 || tenantsStore.loading">
                <vue3-datatable
                    :rows="filteredTenants"
                    :columns="cols"
                    :totalRows="filteredTenants.length"
                    :search="''"
                    :loading="tenantsStore.loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #name="data">
                        <div class="font-semibold">{{ data.value.name }}</div>
                        <div class="text-xs text-white-dark">{{ data.value.slug }}</div>
                    </template>
                    <template #status="data">
                        <span class="badge" :class="getStatusBadgeClass(data.value.status)">
                            {{ data.value.status }}
                        </span>
                    </template>
                    <template #apps="data">
                        <div class="flex flex-wrap gap-1">
                            <span
                                v-for="app in data.value.apps?.slice(0, 3)"
                                :key="app.uuid"
                                class="badge badge-outline-primary text-xs"
                            >
                                {{ app.name }}
                            </span>
                            <span
                                v-if="data.value.apps && data.value.apps.length > 3"
                                class="badge badge-outline-dark text-xs"
                            >
                                +{{ data.value.apps.length - 3 }}
                            </span>
                        </div>
                    </template>
                    <template #description="data">
                        <div class="max-w-xs truncate" :title="data.value.description">
                            {{ data.value.description || '-' }}
                        </div>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                v-if="hasPermission('tenants.edit')"
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="editTenant(data.value)"
                                :disabled="tenantsStore.loading"
                                title="Edit tenant"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <button
                                v-if="hasPermission('tenants.create')"
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="duplicateTenant(data.value)"
                                :disabled="tenantsStore.loading"
                                title="Duplicate tenant"
                            >
                                <icon-copy class="w-3 h-3" />
                            </button>
                            <button
                                v-if="data.value.status === 'active' && hasPermission('tenants.deactivate')"
                                type="button"
                                class="btn btn-outline-warning btn-sm"
                                @click="blockTenant(data.value)"
                                :disabled="tenantsStore.loading"
                                title="Block tenant"
                            >
                                <icon-ban class="w-3 h-3" />
                            </button>
                            <button
                                v-if="data.value.status === 'blocked' && hasPermission('tenants.activate')"
                                type="button"
                                class="btn btn-outline-success btn-sm"
                                @click="unblockTenant(data.value)"
                                :disabled="tenantsStore.loading"
                                title="Unblock tenant"
                            >
                                <icon-check class="w-3 h-3" />
                            </button>
                            <button
                                v-if="hasPermission('tenants.delete')"
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="deleteTenant(data.value)"
                                :disabled="tenantsStore.loading"
                                title="Delete tenant"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No tenants found
            </div>
        </div>

        <!-- Tenant Modal -->
        <TenantModal
            :show="showModal"
            :tenant="selectedTenant"
            :loading="tenantsStore.loading"
            @close="closeModal"
            @save="handleSaveTenant"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { useTenantsStore } from '../stores/tenants';
import { useToast } from '../composables/useToast';
import { usePermissions } from '../composables/usePermissions';
import TenantsHeader from '../components/TenantsHeader.vue';
import TenantModal from '../components/TenantModal.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const tenantsStore = useTenantsStore();
const { hasPermission, loadUserPermissions } = usePermissions();

const filters = ref({
    search: '',
    status: '',
});

const showModal = ref(false);
const selectedTenant = ref<any>(null);

const filteredTenants = computed(() => {
    let filtered = tenantsStore.tenants;

    if (filters.value.search) {
        const term = filters.value.search.toLowerCase();
        filtered = filtered.filter(tenant =>
            tenant.name.toLowerCase().includes(term) ||
            tenant.slug.toLowerCase().includes(term)
        );
    }

    if (filters.value.status) {
        filtered = filtered.filter(tenant => tenant.status === filters.value.status);
    }

    return filtered;
});

const cols = ref([
    { field: 'name', title: 'Name' },
    { field: 'status', title: 'Status' },
    { field: 'apps', title: 'Apps' },
    { field: 'description', title: 'Description' },
    { field: 'created_at', title: 'Created' },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false },
]);

// Watch for filter changes and refetch if needed
watch(filters, () => {
    // Filters are applied client-side for now
}, { deep: true });

onMounted(async () => {
    await Promise.all([
        loadTenants(),
        loadUserPermissions()
    ]);
});

const loadTenants = async () => {
    try {
        await tenantsStore.fetchTenants();
    } catch (error) {
        console.error('Error loading tenants:', error);
        showMessage('Failed to load tenants.', 'error');
    }
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'active': return 'badge-outline-success';
        case 'inactive': return 'badge-outline-warning';
        case 'blocked': return 'badge-outline-danger';
        default: return 'badge-outline-dark';
    }
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const getTimeAgo = (dateString: string): string => {
    try {
        const now = new Date();
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const openCreateModal = () => {
    selectedTenant.value = null;
    showModal.value = true;
};

const editTenant = (tenant: any) => {
    selectedTenant.value = tenant;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedTenant.value = null;
};

const handleSaveTenant = async (tenantData: any) => {
    try {
        let tenantUuid;
        if (selectedTenant.value?.uuid) {
            await tenantsStore.updateTenant(selectedTenant.value.uuid, tenantData);
            tenantUuid = selectedTenant.value.uuid;
            showMessage('Tenant updated successfully.');
        } else {
            const tenant = await tenantsStore.createTenant(tenantData);
            tenantUuid = tenant.uuid;
            showMessage('Tenant created successfully.');
        }

        // Handle app attachments
        if (tenantData.app_uuids && tenantUuid) {
            // Fetch the current tenant with apps
            const currentTenant = await tenantsStore.getTenant(tenantUuid);
            const currentAppUuids = currentTenant.apps?.map(a => a.uuid) || [];

            // Detach removed apps
            const toDetach = currentAppUuids.filter(uuid => !tenantData.app_uuids.includes(uuid));
            for (const appUuid of toDetach) {
                await tenantsStore.detachApp(tenantUuid, appUuid);
            }

            // Attach new apps
            const toAttach = tenantData.app_uuids.filter(uuid => !currentAppUuids.includes(uuid));
            for (const appUuid of toAttach) {
                await tenantsStore.attachApp(tenantUuid, appUuid);
            }
        }

        await tenantsStore.fetchTenants(); // Refresh the list
        closeModal();
    } catch (error: any) {
        console.error('Error saving tenant:', error);
        showMessage(error.message || 'Failed to save tenant.', 'error');
    }
};

const deleteTenant = async (tenant: any) => {
    const result = await Swal.fire({
        title: 'Delete Tenant?',
        text: `Are you sure you want to delete the "${tenant.name}" tenant? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await tenantsStore.deleteTenant(tenant.uuid);
            showMessage('Tenant deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting tenant:', error);
            showMessage(error?.message || 'Failed to delete tenant.', 'error');
        }
    }
};

const duplicateTenant = async (tenant: any) => {
    try {
        await tenantsStore.duplicateTenant(tenant.uuid);
        showMessage('Tenant duplicated successfully.');
        await tenantsStore.fetchTenants(); // Refresh the list
    } catch (error: any) {
        console.error('Error duplicating tenant:', error);
        showMessage(error.message || 'Failed to duplicate tenant.', 'error');
    }
};

const blockTenant = async (tenant: any) => {
    try {
        await tenantsStore.blockTenant(tenant.uuid);
        showMessage('Tenant blocked successfully.');
    } catch (error: any) {
        console.error('Error blocking tenant:', error);
        showMessage(error.message || 'Failed to block tenant.', 'error');
    }
};

const unblockTenant = async (tenant: any) => {
    try {
        await tenantsStore.unblockTenant(tenant.uuid);
        showMessage('Tenant unblocked successfully.');
    } catch (error: any) {
        console.error('Error unblocking tenant:', error);
        showMessage(error.message || 'Failed to unblock tenant.', 'error');
    }
};

const { showToast } = useToast();
const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    showToast(message, type);
};
</script>

<script lang="ts">
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconCopy from '../components/icon/icon-copy.vue';
import IconBan from '../components/icon/icon-ban.vue';
import IconCheck from '../components/icon/icon-check.vue';

export default {
    components: {
        IconEdit,
        IconTrash,
        IconCopy,
        IconBan,
        IconCheck,
    },
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
