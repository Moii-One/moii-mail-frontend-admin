<template>
    <div>
        <AppsHeader
            title="Apps Management"
            v-model="filters"
            @add="openCreateModal"
        />

        <!-- Apps Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-apps class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ appsStore.apps.length }}</h3>
                        <p class="text-white-dark text-sm">Total Apps</p>
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
                        <h3 class="text-xl font-semibold">{{ appsStore.activeApps.length }}</h3>
                        <p class="text-white-dark text-sm">Active Apps</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                            <icon-globe class="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ appsStore.appsByType.web?.length || 0 }}</h3>
                        <p class="text-white-dark text-sm">Web Apps</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-smartphone class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ appsStore.appsByType.mobile?.length || 0 }}</h3>
                        <p class="text-white-dark text-sm">Mobile Apps</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Apps Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="appsStore.apps.length > 0 || appsStore.loading">
                <vue3-datatable
                    :rows="filteredApps"
                    :columns="cols"
                    :totalRows="filteredApps.length"
                    :search="''"
                    :loading="appsStore.loading"
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
                    <template #type="data">
                        <span class="badge" :class="getTypeBadgeClass(data.value.type)">
                            {{ data.value.type }}
                        </span>
                    </template>
                    <template #status="data">
                        <span class="badge" :class="getStatusBadgeClass(data.value.status)">
                            {{ data.value.status }}
                        </span>
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
                                v-if="hasPermission('apps.edit')"
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="editApp(data.value)"
                                :disabled="appsStore.loading"
                                title="Edit app"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <button
                                v-if="hasPermission('apps.create')"
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="duplicateApp(data.value)"
                                :disabled="appsStore.loading"
                                title="Duplicate app"
                            >
                                <icon-copy class="w-3 h-3" />
                            </button>
                            <button
                                v-if="hasPermission('apps.delete')"
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="deleteApp(data.value)"
                                :disabled="appsStore.loading"
                                title="Delete app"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No apps found
            </div>
        </div>

        <!-- App Modal -->
        <AppModal
            :show="showModal"
            :app="selectedApp"
            :loading="appsStore.loading"
            @close="closeModal"
            @save="handleSaveApp"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { useToast } from '../composables/useToast';
import { usePermissions } from '../composables/usePermissions';
import { useAppsStore } from '../stores/apps';
import AppsHeader from '../components/AppsHeader.vue';
import AppModal from '../components/AppModal.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const appsStore = useAppsStore();
const { hasPermission, loadUserPermissions } = usePermissions();

const filters = ref({
    search: '',
    type: '',
    status: '',
});

const showModal = ref(false);
const selectedApp = ref<any>(null);

const filteredApps = computed(() => {
    let filtered = appsStore.apps;

    if (filters.value.search) {
        const term = filters.value.search.toLowerCase();
        filtered = filtered.filter(app =>
            app.name.toLowerCase().includes(term) ||
            app.slug.toLowerCase().includes(term)
        );
    }

    if (filters.value.type) {
        filtered = filtered.filter(app => app.type === filters.value.type);
    }

    if (filters.value.status) {
        filtered = filtered.filter(app => app.status === filters.value.status);
    }

    return filtered;
});

const cols = ref([
    { field: 'name', title: 'Name' },
    { field: 'type', title: 'Type' },
    { field: 'status', title: 'Status' },
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
        loadApps(),
        loadUserPermissions()
    ]);
});

const loadApps = async () => {
    try {
        await appsStore.fetchApps();
    } catch (error) {
        console.error('Error loading apps:', error);
        showMessage('Failed to load apps.', 'error');
    }
};

const getTypeBadgeClass = (type: string) => {
    switch (type) {
        case 'web': return 'badge-outline-info';
        case 'mobile': return 'badge-outline-warning';
        case 'web/mobile': return 'badge-outline-success';
        default: return 'badge-outline-dark';
    }
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'active': return 'badge-outline-success';
        case 'inactive': return 'badge-outline-danger';
        case 'maintenance': return 'badge-outline-warning';
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
    selectedApp.value = null;
    showModal.value = true;
};

const editApp = (app: any) => {
    selectedApp.value = app;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedApp.value = null;
};

const handleSaveApp = async (appData: any) => {
    try {
        let appUuid;
        if (selectedApp.value?.uuid) {
            await appsStore.updateApp(selectedApp.value.uuid, appData);
            appUuid = selectedApp.value.uuid;
            showMessage('App updated successfully.');
        } else {
            const app = await appsStore.createApp(appData);
            appUuid = app.uuid;
            showMessage('App created successfully.');
        }

        // Handle tenant attachments
        if (appData.tenant_uuids && appUuid) {
            // Fetch the current app with tenants
            const currentApp = await appsStore.getApp(appUuid);
            const currentTenantUuids = currentApp.tenants?.map(t => t.uuid) || [];

            // Detach removed tenants
            const toDetach = currentTenantUuids.filter(uuid => !appData.tenant_uuids.includes(uuid));
            for (const tenantUuid of toDetach) {
                await appsStore.detachTenant(appUuid, tenantUuid);
            }

            // Attach new tenants
            const toAttach = appData.tenant_uuids.filter(uuid => !currentTenantUuids.includes(uuid));
            for (const tenantUuid of toAttach) {
                await appsStore.attachTenant(appUuid, tenantUuid);
            }
        }

        await appsStore.fetchApps(); // Refresh the list
        closeModal();
    } catch (error: any) {
        console.error('Error saving app:', error);
        showMessage(error.message || 'Failed to save app.', 'error');
    }
};

const deleteApp = async (app: any) => {
    const result = await Swal.fire({
        title: 'Delete App?',
        text: `Are you sure you want to delete the "${app.name}" app? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await appsStore.deleteApp(app.uuid);
            showMessage('App deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting app:', error);
            showMessage(error?.message || 'Failed to delete app.', 'error');
        }
    }
};

const duplicateApp = (app: any) => {
    // Create a duplicate object with modified name and slug
    const duplicateData = {
        ...app,
        name: app.name + ' (Copy)',
        slug: app.slug + '_copy',
        uuid: null, // Clear UUID so it's treated as new
        id: null, // Clear ID so it's treated as new
        created_at: null, // Clear timestamps
        updated_at: null,
    };

    // Set the selected app to the duplicate data
    selectedApp.value = duplicateData;
    showModal.value = true;
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

export default {
    components: {
        IconEdit,
        IconTrash,
        IconCopy,
    },
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
