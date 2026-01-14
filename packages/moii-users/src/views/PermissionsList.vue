<template>
    <div class="mb-6">
        <!-- Header Panel -->
        <PermissionsHeader
            title="Permissions Management"
            v-model="filters"
            :unique-categories="uniqueCategories"
            @create-permission="openCreatePermissionModal"
        />

        <!-- Permissions Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-key class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ filteredPermissions.length }}</h3>
                        <p class="text-white-dark text-sm">Total Permissions</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-folder class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ uniqueCategories.length }}</h3>
                        <p class="text-white-dark text-sm">Categories</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                            <icon-shield-check class="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ assignedPermissions.length }}</h3>
                        <p class="text-white-dark text-sm">Assigned to Roles</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Permissions Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="filteredPermissions.length > 0 || rolesStore.loading">
                <vue3-datatable
                    :rows="filteredPermissions"
                    :columns="cols"
                    :totalRows="filteredPermissions.length"
                    :search="''"
                    :loading="rolesStore.loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #key="data">
                        <div class="font-semibold">{{ data.value.key }}</div>
                        <div class="text-xs text-white-dark" v-if="data.value.description">
                            {{ data.value.description }}
                        </div>
                    </template>
                    <template #category="data">
                        <span class="badge badge-outline-primary" v-if="data.value.category">
                            {{ data.value.category }}
                        </span>
                        <span class="text-gray-400" v-else>-</span>
                    </template>
                    <template #roles="data">
                        <div class="flex flex-wrap gap-1">
                            <span 
                                v-for="role in getPermissionRoles(data.value.key)" 
                                :key="role.uuid"
                                class="badge badge-outline-info text-xs"
                            >
                                {{ role.name }}
                            </span>
                        </div>
                        <div v-if="getPermissionRoles(data.value.key).length === 0" class="text-gray-400 text-sm">
                            Not assigned
                        </div>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="editPermission(data.value)"
                                :disabled="rolesStore.loading"
                                title="Edit permission"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="deletePermission(data.value)"
                                :disabled="rolesStore.loading"
                                title="Delete permission"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No permissions found
            </div>
        </div>

        <!-- Create/Edit Permission Modal -->
        <div class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto hidden" :class="{ '!block': showPermissionModal }">
            <div class="flex items-start justify-center min-h-screen px-4 pt-6">
                <div 
                    class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn"
                    @click.stop
                >
                    <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <h5 class="font-bold text-lg">{{ isEditing ? 'Edit' : 'Create' }} Permission</h5>
                        <button type="button" @click="closePermissionModal" class="text-white-dark hover:text-dark">
                            <icon-x class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="p-5">
                        <form @submit.prevent="savePermission">
                            <div class="mb-5">
                                <label for="permissionKey" class="text-white-dark text-sm">Permission Key:</label>
                                <input 
                                    id="permissionKey"
                                    type="text"
                                    v-model="permissionForm.key"
                                    placeholder="e.g., users.create"
                                    class="form-input mt-1"
                                    required
                                />
                            </div>
                            <div class="mb-5">
                                <label for="permissionCategory" class="text-white-dark text-sm">Category:</label>
                                <input 
                                    id="permissionCategory"
                                    type="text"
                                    v-model="permissionForm.category"
                                    placeholder="e.g., users, admin, content"
                                    class="form-input mt-1"
                                />
                            </div>
                            <div class="mb-5">
                                <label for="permissionDescription" class="text-white-dark text-sm">Description:</label>
                                <textarea 
                                    id="permissionDescription"
                                    v-model="permissionForm.description"
                                    placeholder="Enter permission description"
                                    class="form-textarea mt-1"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="flex justify-end items-center mt-8">
                                <button type="button" @click="closePermissionModal" class="btn btn-outline-danger">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                    :disabled="rolesStore.loading"
                                >
                                    <div v-if="rolesStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {{ isEditing ? 'Update' : 'Create' }} Permission
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { useRolesStore, type Permission } from '../stores/roles';
import { useToast } from '../composables/useToast';
import PermissionsHeader from '../components/PermissionsHeader.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import IconMenu from '../components/icon/icon-menu.vue';
import IconCaretDown from '../components/icon/icon-caret-down.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';
import IconKey from '../components/icon/icon-key.vue';
import IconFolder from '../components/icon/icon-folder.vue';
import IconShieldCheck from '../components/icon/icon-shield-check.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconX from '../components/icon/icon-x.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import VueCollapsible from 'vue-height-collapsible/vue3';
import CustomSelect from '../components/CustomSelect.vue';
import IconSearch from '../components/icon/icon-search.vue';

const rolesStore = useRolesStore();

const filters = ref({
    searchTerm: '',
    filterCategory: ''
});

const pagination = ref({
    currentPage: 1,
    perPage: 500 // Load all permissions at once
});

const showPermissionModal = ref(false);
const isEditing = ref(false);
const selectedPermission = ref<Permission | null>(null);

const permissionForm = ref({
    key: '',
    category: '',
    description: ''
});

// Watch for search term changes and trigger server-side search with debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(() => filters.value.searchTerm, (newValue) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        handleSearch();
    }, 500); // 500ms debounce
});


const filteredPermissions = computed(() => {
    let filtered = rolesStore.permissions;

    // Client-side category filter (since backend doesn't support it)
    if (filters.value.filterCategory) {
        filtered = filtered.filter(permission => permission.category === filters.value.filterCategory);
    }

    return filtered;
});

const uniqueCategories = computed(() => {
    const categories = rolesStore.permissions
        .map(p => p.category)
        .filter((c): c is string => Boolean(c));
    return [...new Set(categories)].sort();
});

const categoryOptions = computed(() => [
    { value: '', label: 'All Categories' },
    ...uniqueCategories.value.map(category => ({
        value: category,
        label: category
    }))
]);

const assignedPermissions = computed(() => {
    return rolesStore.permissions.filter(permission => {
        return rolesStore.roles.some(role => 
            role.permissions?.some(p => p.key === permission.key)
        );
    });
});

const cols = ref([
    { field: 'key', title: 'Permission Key' },
    { field: 'category', title: 'Category' },
    { field: 'roles', title: 'Assigned to Roles', sort: false },
    { field: 'created_at', title: 'Created' },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false },
]);

onMounted(async () => {
    await loadData();
});

const loadData = async () => {
    try {
        await Promise.all([
            rolesStore.getAllPermissions(pagination.value.currentPage, pagination.value.perPage, filters.value.searchTerm),
            rolesStore.getAllRoles()
        ]);
    } catch (error) {
        console.error('Error loading permissions data:', error);
        showMessage('Failed to load permissions data.', 'error');
    }
};

const handlePageChange = async (page: number) => {
    pagination.value.currentPage = page;
    await loadData();
};

const handleSearch = async () => {
    pagination.value.currentPage = 1; // Reset to first page on search
    await loadData();
};

const clearFilters = () => {
    filters.value = {
        searchTerm: '',
        filterCategory: ''
    };
    pagination.value.currentPage = 1;
    loadData();
};

const getPermissionRoles = (permissionKey: string) => {
    return rolesStore.roles.filter(role => 
        role.permissions?.some(p => p.key === permissionKey)
    );
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

const openCreatePermissionModal = () => {
    isEditing.value = false;
    permissionForm.value = {
        key: '',
        category: '',
        description: ''
    };
    showPermissionModal.value = true;
};

const editPermission = (permission: Permission) => {
    isEditing.value = true;
    permissionForm.value = {
        key: permission.key,
        category: permission.category || '',
        description: permission.description || ''
    };
    selectedPermission.value = permission;
    showPermissionModal.value = true;
};

const closePermissionModal = () => {
    showPermissionModal.value = false;
    selectedPermission.value = null;
};

const savePermission = async () => {
    try {
        if (isEditing.value && selectedPermission.value) {
            await rolesStore.updatePermission(selectedPermission.value.uuid, permissionForm.value);
            showMessage('Permission updated successfully.');
        } else {
            await rolesStore.createPermission(permissionForm.value);
            showMessage('Permission created successfully.');
        }
        closePermissionModal();
        await loadData();
    } catch (error: any) {
        console.error('Error saving permission:', error);
        showMessage(error?.message || 'Failed to save permission.', 'error');
    }
};

const deletePermission = async (permission: Permission) => {
    const rolesUsingPermission = getPermissionRoles(permission.key);
    
    let confirmText = `Are you sure you want to delete the "${permission.key}" permission? This action cannot be undone.`;
    if (rolesUsingPermission.length > 0) {
        confirmText += `\n\nThis permission is currently assigned to ${rolesUsingPermission.length} role(s): ${rolesUsingPermission.map(r => r.name).join(', ')}`;
    }

    const result = await Swal.fire({
        title: 'Delete Permission?',
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await rolesStore.deletePermission(permission.uuid);
            showMessage('Permission deleted successfully.');
            await loadData();
        } catch (error: any) {
            console.error('Error deleting permission:', error);
            showMessage(error?.message || 'Failed to delete permission.', 'error');
        }
    }
};

const { showToast } = useToast();
const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    showToast(message, type);
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>

<style scoped>
.animate__animated {
    animation-duration: 0.3s;
}

.animate__fadeIn {
    animation-name: fadeIn;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
