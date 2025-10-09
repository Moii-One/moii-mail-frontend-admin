<template>
    <div class="mb-6">
        <!-- Header Panel -->
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">Roles Management</h5>
                <p class="text-white-dark text-sm mt-1">Create, edit, and manage system roles</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="openCreateRoleModal"
                    :disabled="rolesStore.loading"
                >
                    <icon-plus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create Role
                </button>
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="showFilters = !showFilters"
                >
                    <icon-menu class="ltr:mr-2 rtl:ml-2" />
                    Filters
                    <icon-caret-down class="ltr:ml-2 rtl:mr-2" :class="{ 'rotate-180': showFilters }" />
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div v-if="showFilters" class="panel mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="text-sm font-semibold mb-2 block">Search</label>
                    <input
                        type="text"
                        placeholder="Search roles..."
                        class="form-input"
                        v-model="searchTerm"
                    />
                </div>
                <div>
                    <label class="text-sm font-semibold mb-2 block">Scope Type</label>
                    <select v-model="filterScope" class="form-select">
                        <option value="">All Scopes</option>
                        <option value="system">System</option>
                        <option value="organisation">Organisation</option>
                        <option value="app">App</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button type="button" class="btn btn-outline-warning" @click="clearFilters">
                        <icon-refresh class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                        Clear
                    </button>
                </div>
            </div>
        </div>

        <!-- Roles Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-shield-check class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ filteredRoles.length }}</h3>
                        <p class="text-white-dark text-sm">Total Roles</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-server class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ systemRoles.length }}</h3>
                        <p class="text-white-dark text-sm">System Roles</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-building class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ organisationRoles.length }}</h3>
                        <p class="text-white-dark text-sm">Organisation Roles</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Roles Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="filteredRoles.length > 0 || rolesStore.loading">
                <vue3-datatable
                    :rows="filteredRoles"
                    :columns="cols"
                    :totalRows="filteredRoles.length"
                    :search="''"
                    :loading="rolesStore.loading"
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
                    <template #scope_type="data">
                        <span class="badge" :class="getScopeColor(data.value.scope_type)">
                            {{ data.value.scope_type }}
                        </span>
                    </template>
                    <template #permissions="data">
                        <span class="badge badge-outline-info">
                            {{ data.value.permissions?.length || 0 }} permissions
                        </span>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="managePermissions(data.value)"
                                :disabled="rolesStore.loading"
                                title="Manage permissions"
                            >
                                <icon-key class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="editRole(data.value)"
                                :disabled="rolesStore.loading"
                                title="Edit role"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="deleteRole(data.value)"
                                :disabled="rolesStore.loading"
                                title="Delete role"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No roles found
            </div>
        </div>

        <!-- Create/Edit Role Modal -->
        <div class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto hidden" :class="{ '!block': showRoleModal }">
            <div class="flex items-start justify-center min-h-screen px-4 pt-6">
                <div 
                    class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn"
                    @click.stop
                >
                    <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <h5 class="font-bold text-lg">{{ isEditing ? 'Edit' : 'Create' }} Role</h5>
                        <button type="button" @click="closeRoleModal" class="text-white-dark hover:text-dark">
                            <icon-x class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="p-5">
                        <form @submit.prevent="saveRole">
                            <div class="mb-5">
                                <label for="roleName" class="text-white-dark text-sm">Role Name:</label>
                                <input 
                                    id="roleName"
                                    type="text"
                                    v-model="roleForm.name"
                                    placeholder="Enter role name"
                                    class="form-input mt-1"
                                    required
                                />
                            </div>
                            <div class="mb-5">
                                <label for="roleSlug" class="text-white-dark text-sm">Slug:</label>
                                <input 
                                    id="roleSlug"
                                    type="text"
                                    v-model="roleForm.slug"
                                    placeholder="Enter role slug (auto-generated if empty)"
                                    class="form-input mt-1"
                                />
                            </div>
                            <div class="mb-5">
                                <label for="roleScope" class="text-white-dark text-sm">Scope Type:</label>
                                <select 
                                    id="roleScope"
                                    v-model="roleForm.scope_type"
                                    class="form-select mt-1"
                                    required
                                >
                                    <option value="">Choose scope...</option>
                                    <option value="system">System</option>
                                    <option value="organisation">Organisation</option>
                                    <option value="app">App</option>
                                </select>
                            </div>
                            <div class="mb-5" v-if="roleForm.scope_type && roleForm.scope_type !== 'system'">
                                <label for="roleScopeId" class="text-white-dark text-sm">Scope ID:</label>
                                <input 
                                    id="roleScopeId"
                                    type="number"
                                    v-model.number="roleForm.scope_id"
                                    placeholder="Enter scope ID"
                                    class="form-input mt-1"
                                />
                            </div>
                            <div class="mb-5">
                                <label for="roleDescription" class="text-white-dark text-sm">Description:</label>
                                <textarea 
                                    id="roleDescription"
                                    v-model="roleForm.description"
                                    placeholder="Enter role description"
                                    class="form-textarea mt-1"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="flex justify-end items-center mt-8">
                                <button type="button" @click="closeRoleModal" class="btn btn-outline-danger">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                    :disabled="rolesStore.loading"
                                >
                                    <div v-if="rolesStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {{ isEditing ? 'Update' : 'Create' }} Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Manage Permissions Modal -->
        <div class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto hidden" :class="{ '!block': showPermissionsModal }">
            <div class="flex items-start justify-center min-h-screen px-4 pt-6">
                <div 
                    class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl my-8 text-black dark:text-white-dark animate__animated animate__fadeIn"
                    @click.stop
                >
                    <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <h5 class="font-bold text-lg">Manage Permissions: {{ selectedRole?.name }}</h5>
                        <button type="button" @click="closePermissionsModal" class="text-white-dark hover:text-dark">
                            <icon-x class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="p-5">
                        <div class="mb-5">
                            <div class="flex items-center justify-between mb-3">
                                <h6 class="font-semibold">Available Permissions</h6>
                                <div class="flex items-center gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-outline-success btn-sm"
                                        @click="selectAllPermissions"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-outline-warning btn-sm"
                                        @click="deselectAllPermissions"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>
                            <div class="max-h-96 overflow-y-auto border rounded p-3 space-y-2">
                                <label 
                                    v-for="permission in rolesStore.permissions" 
                                    :key="permission.uuid"
                                    class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        :value="permission.key"
                                        v-model="selectedPermissions"
                                        class="form-checkbox"
                                    />
                                    <div class="flex-1">
                                        <div class="font-medium text-sm">{{ permission.key }}</div>
                                        <div class="text-xs text-white-dark" v-if="permission.description">
                                            {{ permission.description }}
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div class="flex justify-end items-center mt-8">
                            <button type="button" @click="closePermissionsModal" class="btn btn-outline-danger">
                                Cancel
                            </button>
                            <button 
                                type="button"
                                @click="savePermissions"
                                class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                :disabled="rolesStore.loading"
                            >
                                <div v-if="rolesStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Save Permissions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { useRolesStore, type Role } from '../stores/roles';
import IconPlus from '../components/icon/icon-plus.vue';
import IconMenu from '../components/icon/icon-menu.vue';
import IconCaretDown from '../components/icon/icon-caret-down.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';
import IconShieldCheck from '../components/icon/icon-shield-check.vue';
import IconServer from '../components/icon/icon-server.vue';
import IconBuilding from '../components/icon/icon-building.vue';
import IconKey from '../components/icon/icon-key.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconX from '../components/icon/icon-x.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const rolesStore = useRolesStore();

const showFilters = ref(false);
const searchTerm = ref('');
const filterScope = ref('');

const showRoleModal = ref(false);
const showPermissionsModal = ref(false);
const isEditing = ref(false);
const selectedRole = ref<Role | null>(null);
const selectedPermissions = ref<string[]>([]);

const roleForm = ref({
    name: '',
    slug: '',
    scope_type: '' as 'app' | 'system' | 'organisation' | '',
    scope_id: undefined as number | undefined,
    description: ''
});

const filteredRoles = computed(() => {
    let filtered = rolesStore.roles;

    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(role => 
            role.name.toLowerCase().includes(term) ||
            role.slug.toLowerCase().includes(term)
        );
    }

    if (filterScope.value) {
        filtered = filtered.filter(role => role.scope_type === filterScope.value);
    }

    return filtered;
});

const systemRoles = computed(() => 
    rolesStore.roles.filter(role => role.scope_type === 'system')
);

const organisationRoles = computed(() => 
    rolesStore.roles.filter(role => role.scope_type === 'organisation')
);

const cols = ref([
    { field: 'name', title: 'Name' },
    { field: 'scope_type', title: 'Scope' },
    { field: 'permissions', title: 'Permissions', sort: false },
    { field: 'created_at', title: 'Created' },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false },
]);

// Auto-generate slug from name
watch(() => roleForm.value.name, (newName) => {
    if (!roleForm.value.slug) {
        roleForm.value.slug = newName.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
});

onMounted(async () => {
    await loadData();
});

const loadData = async () => {
    try {
        await Promise.all([
            rolesStore.getAllRoles(),
            rolesStore.getAllPermissions()
        ]);
    } catch (error) {
        console.error('Error loading roles data:', error);
        showMessage('Failed to load roles data.', 'error');
    }
};

const clearFilters = () => {
    searchTerm.value = '';
    filterScope.value = '';
};

const getScopeColor = (scope: string) => {
    switch (scope) {
        case 'system': return 'badge-outline-danger';
        case 'organisation': return 'badge-outline-warning';
        case 'app': return 'badge-outline-info';
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

const openCreateRoleModal = () => {
    isEditing.value = false;
    roleForm.value = {
        name: '',
        slug: '',
        scope_type: '',
        scope_id: undefined,
        description: ''
    };
    showRoleModal.value = true;
};

const editRole = (role: Role) => {
    isEditing.value = true;
    roleForm.value = {
        name: role.name,
        slug: role.slug,
        scope_type: role.scope_type,
        scope_id: role.scope_id,
        description: role.description || ''
    };
    selectedRole.value = role;
    showRoleModal.value = true;
};

const closeRoleModal = () => {
    showRoleModal.value = false;
    selectedRole.value = null;
};

const saveRole = async () => {
    try {
        const formData = {
            ...roleForm.value,
            scope_type: roleForm.value.scope_type || undefined
        };

        if (isEditing.value && selectedRole.value) {
            await rolesStore.updateRole(selectedRole.value.uuid, formData);
            showMessage('Role updated successfully.');
            await loadData();
        } else {
            await rolesStore.createRole(formData);
            showMessage('Role created successfully.');
            await loadData();
        }
        closeRoleModal();
    } catch (error: any) {
        console.error('Error saving role:', error);
        showMessage(error?.message || 'Failed to save role.', 'error');
    }
};

const deleteRole = async (role: Role) => {
    const result = await Swal.fire({
        title: 'Delete Role?',
        text: `Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await rolesStore.deleteRole(role.uuid);
            showMessage('Role deleted successfully.');
            await loadData();
        } catch (error: any) {
            console.error('Error deleting role:', error);
            showMessage(error?.message || 'Failed to delete role.', 'error');
        }
    }
};

const managePermissions = (role: Role) => {
    selectedRole.value = role;
    selectedPermissions.value = role.permissions?.map(p => p.key) || [];
    showPermissionsModal.value = true;
};

const closePermissionsModal = () => {
    showPermissionsModal.value = false;
    selectedRole.value = null;
    selectedPermissions.value = [];
};

const selectAllPermissions = () => {
    selectedPermissions.value = rolesStore.permissions.map(p => p.key);
};

const deselectAllPermissions = () => {
    selectedPermissions.value = [];
};

const savePermissions = async () => {
    if (!selectedRole.value) return;

    try {
        await rolesStore.assignPermissionsToRole(selectedRole.value.uuid, selectedPermissions.value);
        showMessage('Permissions updated successfully.');
        closePermissionsModal();
        await loadData();
    } catch (error: any) {
        console.error('Error updating permissions:', error);
        showMessage(error?.message || 'Failed to update permissions.', 'error');
    }
};

const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    toast.fire({
        icon: type,
        title: message,
    });
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
