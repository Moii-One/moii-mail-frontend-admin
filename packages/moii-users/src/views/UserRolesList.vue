<template>
    <div class="mb-6">
        <!-- Header Panel -->
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">User Roles & Permissions</h5>
                <p class="text-white-dark text-sm mt-1">Manage roles and permissions for this user</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="openAssignRoleModal"
                    :disabled="rolesStore.loading"
                >
                    <icon-plus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Assign Role
                </button>
            </div>
        </div>

        <!-- User Info -->
        <div class="panel mb-6" v-if="userInfo">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <icon-user class="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 class="text-lg font-semibold">{{ userInfo.first_name }} {{ userInfo.last_name }}</h3>
                    <p class="text-white-dark">{{ userInfo.email }}</p>
                </div>
            </div>
        </div>

        <!-- Roles Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- User Roles -->
            <div class="panel">
                <div class="flex items-center justify-between mb-4">
                    <h6 class="text-lg font-semibold">Assigned Roles</h6>
                    <span class="badge badge-outline-primary">{{ userRoles.length }}</span>
                </div>
                
                <div v-if="rolesStore.loading" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                
                <div v-else-if="userRoles.length === 0" class="text-center py-8 text-white-dark">
                    No roles assigned
                </div>
                
                <div v-else class="space-y-3">
                    <div 
                        v-for="role in userRoles" 
                        :key="role.uuid"
                        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                        <div>
                            <h6 class="font-medium">{{ role.name }}</h6>
                            <p class="text-sm text-white-dark">{{ role.scope_type }} scope</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="badge" :class="getScopeColor(role.scope_type)">
                                {{ role.scope_type }}
                            </span>
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="unassignRole(role)"
                                :disabled="rolesStore.loading"
                                title="Remove role"
                            >
                                <icon-x class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Permissions -->
            <div class="panel">
                <div class="flex items-center justify-between mb-4">
                    <h6 class="text-lg font-semibold">Effective Permissions</h6>
                    <span class="badge badge-outline-success">{{ userPermissions.length }}</span>
                </div>
                
                <div v-if="rolesStore.loading" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                
                <div v-else-if="userPermissions.length === 0" class="text-center py-8 text-white-dark">
                    No permissions available
                </div>
                
                <div v-else class="space-y-3">
                    <div 
                        v-for="group in groupedPermissions" 
                        :key="group.category"
                        class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                        <button
                            type="button"
                            @click="toggleCategory(group.category)"
                            class="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-sm">{{ group.category.charAt(0).toUpperCase() + group.category.slice(1) }}</span>
                                <span class="badge badge-outline-primary text-xs">{{ group.count }}</span>
                            </div>
                            <svg 
                                class="w-4 h-4 transition-transform" 
                                :class="{ 'rotate-180': expandedCategories[group.category] }"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div v-if="expandedCategories[group.category]" class="p-3 bg-white dark:bg-gray-900">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div 
                                    v-for="permission in group.permissions" 
                                    :key="permission.uuid"
                                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                                >
                                    <div class="flex-1 min-w-0">
                                        <code class="text-xs font-mono text-primary block truncate">{{ permission.key }}</code>
                                        <p class="text-xs text-white-dark mt-1" v-if="permission.description">
                                            {{ permission.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assign Role Modal -->
        <div class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto hidden" :class="{ '!block': showAssignRoleModal }">
            <div class="flex items-start justify-center min-h-screen px-4 pt-6">
                <div 
                    class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn"
                    @click.stop
                >
                    <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <h5 class="font-bold text-lg">Assign Role</h5>
                        <button type="button" @click="closeAssignRoleModal" class="text-white-dark hover:text-dark">
                            <icon-x class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="p-5">
                        <form @submit.prevent="assignRole">
                            <div class="mb-5">
                                <label for="roleSelect" class="text-white-dark text-sm">Select Role:</label>
                                <select 
                                    id="roleSelect"
                                    v-model="selectedRoleUuid"
                                    class="form-select mt-1"
                                    required
                                >
                                    <option value="">Choose a role...</option>
                                    <option 
                                        v-for="role in availableRoles" 
                                        :key="role.uuid" 
                                        :value="role.uuid"
                                    >
                                        {{ role.name }} ({{ role.scope_type }})
                                    </option>
                                </select>
                            </div>
                            <div class="flex justify-end items-center mt-8">
                                <button type="button" @click="closeAssignRoleModal" class="btn btn-outline-danger">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                    :disabled="rolesStore.loading || !selectedRoleUuid"
                                >
                                    <div v-if="rolesStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Assign Role
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useRolesStore, type Role } from '../stores/roles';
import { useToast } from '../composables/useToast';
import IconPlus from '../components/icon/icon-plus.vue';
import IconUser from '../components/icon/icon-user.vue';
import IconX from '../components/icon/icon-x.vue';

const route = useRoute();
const rolesStore = useRolesStore();

const userInfo = ref<{
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
} | null>(null);

const userRoles = ref<Role[]>([]);
const userPermissions = ref<any[]>([]);
const showAssignRoleModal = ref(false);
const selectedRoleUuid = ref('');
const expandedCategories = ref<Record<string, boolean>>({});

const availableRoles = computed(() => {
    const assignedRoleUuids = userRoles.value.map(r => r.uuid);
    return rolesStore.roles.filter(role => !assignedRoleUuids.includes(role.uuid));
});

const groupedPermissions = computed(() => {
    const groups: Record<string, any[]> = {};
    
    userPermissions.value.forEach(permission => {
        const category = permission.key.split('.')[0] || 'other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
    });
    
    return Object.entries(groups).map(([category, permissions]) => ({
        category,
        permissions,
        count: permissions.length
    })).sort((a, b) => a.category.localeCompare(b.category));
});

onMounted(async () => {
    await loadData();
});

const loadData = async () => {
    try {
        // Get all available roles
        await rolesStore.getAllRoles();
        
        // Get user's current permissions and roles (this also sets userInfo)
        const data = await rolesStore.getUserRolesAndPermissions(route.params.userUuid as string);
        if (data.user) {
            userInfo.value = data.user;
        }
        userRoles.value = data.roles || [];
        userPermissions.value = data.permissions || [];
    } catch (error) {
        console.error('Error loading user role data:', error);
        showMessage('Failed to load user role data.', 'error');
    }
};

const getScopeColor = (scope: string) => {
    switch (scope) {
        case 'system': return 'badge-outline-danger';
        case 'organisation': return 'badge-outline-warning';
        case 'app': return 'badge-outline-info';
        default: return 'badge-outline-dark';
    }
};

const openAssignRoleModal = () => {
    selectedRoleUuid.value = '';
    showAssignRoleModal.value = true;
};

const closeAssignRoleModal = () => {
    showAssignRoleModal.value = false;
    selectedRoleUuid.value = '';
};

const toggleCategory = (category: string) => {
    expandedCategories.value[category] = !expandedCategories.value[category];
};

const assignRole = async () => {
    if (!selectedRoleUuid.value || !userInfo.value) return;

    try {
        await rolesStore.assignRolesToUser(userInfo.value.uuid, [selectedRoleUuid.value]);
        showMessage('Role assigned successfully.');
        closeAssignRoleModal();
        
        // Reload user data
        await loadData();
    } catch (error: any) {
        console.error('Error assigning role:', error);
        showMessage(error?.message || 'Failed to assign role.', 'error');
    }
};

const unassignRole = async (role: Role) => {
    if (!userInfo.value) return;

    const result = await Swal.fire({
        title: 'Remove Role?',
        text: `Are you sure you want to remove the "${role.name}" role from this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await rolesStore.unassignRolesFromUser(userInfo.value.uuid, [role.uuid]);
            showMessage('Role removed successfully.');
            
            // Reload user data
            await loadData();
        } catch (error: any) {
            console.error('Error removing role:', error);
            showMessage(error?.message || 'Failed to remove role.', 'error');
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
