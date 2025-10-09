<template>
    <div class="mb-6">
        <UsersHeader
            title="User Management"
            v-model="filters"
            @create-user="openCreateUserModal"
        />

        <!-- Users Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-users class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ usersStore.totalUsers }}</h3>
                        <p class="text-white-dark text-sm">Total Users</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-square-check class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ usersStore.activeUsers.length }}</h3>
                        <p class="text-white-dark text-sm">Active Users</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-pause class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ usersStore.inactiveUsers.length }}</h3>
                        <p class="text-white-dark text-sm">Inactive Users</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-lock class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ usersStore.lockedUsers.length }}</h3>
                        <p class="text-white-dark text-sm">Locked Accounts</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="filteredUsers"
                    :columns="cols"
                    :totalRows="usersStore.pagination.total"
                    :search="filters.search"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #name="data">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold text-primary">{{ getInitials(data.value.name) }}</span>
                                </div>
                            </div>
                            <div class="ltr:ml-3 rtl:mr-3">
                                <div class="font-semibold">{{ data.value.name }}</div>
                                <div class="text-xs text-white-dark">{{ data.value.email }}</div>
                            </div>
                        </div>
                    </template>
                    <template #roles="data">
                        <div v-if="data.value.roles && data.value.roles.length > 0" class="flex flex-wrap gap-1">
                            <span v-for="role in data.value.roles" :key="role.uuid" class="badge badge-outline-primary">
                                {{ role.display_name || role.name }}
                            </span>
                        </div>
                        <span v-else class="text-white-dark">No role</span>
                    </template>
                    <template #status="data">
                        <span class="badge" :class="getStatusBadgeClass(data.value.status)">
                            {{ getStatusLabel(data.value.status) }}</span>
                        <div v-if="data.value.is_locked" class="text-xs text-danger mt-1">
                            <icon-lock class="w-3 h-3 inline mr-1" />
                            Locked
                        </div>
                    </template>
                    <template #company="data">
                        <span v-if="data.value.company">{{ data.value.company }}</span>
                        <span v-else class="text-white-dark">-</span>
                    </template>
                    <template #failed_login_attempts="data">
                        <span :class="getFailedAttemptsClass(data.value.failed_login_attempts)">
                            {{ data.value.failed_login_attempts }}
                        </span>
                    </template>
                    <template #two_factor_enabled="data">
                        <span class="badge" :class="data.value.two_factor_enabled ? 'badge-outline-success' : 'badge-outline-secondary'">
                            {{ data.value.two_factor_enabled ? 'Enabled' : 'Disabled' }}
                        </span>
                    </template>
                    <template #last_login_at="data">
                        <div v-if="data.value.last_login_at">
                            <div class="text-sm">{{ formatDate(data.value.last_login_at) }}</div>
                            <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.last_login_at) }}</div>
                        </div>
                        <span v-else class="text-white-dark">Never</span>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-info"
                                @click="viewUser(data.value)"
                                title="View User Details"
                            >
                                <icon-eye class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                @click="editUser(data.value)"
                                title="Edit User"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <div class="dropdown">
                                <Popper
                                    :placement="'bottom-end'"
                                    offsetDistance="0"
                                    class="align-middle"
                                >
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-secondary"
                                        title="More Actions"
                                    >
                                        <icon-dots-vertical class="w-3 h-3" />
                                    </button>
                                    <template #content="{ close }">
                                        <ul class="!min-w-[170px]" @click="close()">
                                            <li>
                                                <button
                                                    class="w-full text-left"
                                                    @click="toggleUserStatus(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-pause v-if="data.value.status === 'active'" class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    <icon-play v-else class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    {{ data.value.status === 'active' ? 'Deactivate' : 'Activate' }}
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left"
                                                    @click="toggleAccountLock(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-lock v-if="!data.value.is_locked" class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    <icon-unlock v-else class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    {{ data.value.is_locked ? 'Unlock Account' : 'Lock Account' }}
                                                </button>
                                            </li>
                                            <li v-if="data.value.failed_login_attempts > 0">
                                                <button
                                                    class="w-full text-left"
                                                    @click="resetFailedAttempts(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-refresh class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    Reset Failed Attempts
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left"
                                                    @click="manageUser2FA(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-shield class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    {{ data.value.two_factor_enabled ? 'Disable' : 'Enable' }} 2FA
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left"
                                                    @click="viewUserSessions(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-monitor class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    View Sessions
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left"
                                                    @click="manageUserRoles(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-shield-check class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    Manage Roles
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left text-danger"
                                                    @click="terminateUserSessions(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-logout class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    Terminate Sessions
                                                </button>
                                            </li>
                                            <li>
                                                <hr class="my-1">
                                            </li>
                                            <li>
                                                <button
                                                    class="w-full text-left text-danger"
                                                    @click="deleteUser(data.value)"
                                                    :disabled="usersStore.loading"
                                                >
                                                    <icon-trash class="w-3 h-3 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                    Delete User
                                                </button>
                                            </li>
                                        </ul>
                                    </template>
                                </Popper>
                            </div>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- User Modal -->
        <UserModal
            v-if="showUserModal"
            :user="selectedUser"
            :is-create="isCreateMode"
            @close="closeUserModal"
            @save="handleUserSave"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Popper from 'vue3-popper';
import { useUsersStore, type User } from '../stores/users';
import UsersHeader from '../components/UsersHeader.vue';
import UserModal from '../components/UserModal.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconSquareCheck from '../components/icon/icon-square-check.vue';
import IconPause from '../components/icon/icon-pause.vue';
import IconLock from '../components/icon/icon-lock.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconDotsVertical from '../components/icon/icon-dots-vertical.vue';
import IconPlay from '../components/icon/icon-play.vue';
import IconUnlock from '../components/icon/icon-unlock.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';
import IconShield from '../components/icon/icon-shield.vue';
import IconShieldCheck from '../components/icon/icon-shield-check.vue';
import IconLogout from '../components/icon/icon-logout.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconMonitor from '../components/icon/icon-monitor.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

interface UserFilterModel {
    search: string;
    status: string;
    company: string;
    locked: string;
}

const usersStore = useUsersStore();
const router = useRouter();

const filters = ref<UserFilterModel>({
    search: '',
    status: '',
    company: '',
    locked: ''
});

const showUserModal = ref(false);
const selectedUser = ref<User | null>(null);
const isCreateMode = ref(false);

const cols = ref([
    { field: 'name', title: 'User' },
    { field: 'roles', title: 'Role', sort: false },
    { field: 'status', title: 'Status' },
    { field: 'company', title: 'Company' },
    { field: 'failed_login_attempts', title: 'Failed Attempts' },
    { field: 'two_factor_enabled', title: '2FA' },
    { field: 'last_login_at', title: 'Last Login' },
    { field: 'created_at', title: 'Created' },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false },
]);

// Filter users based on selection
const filteredUsers = computed(() => {
    let results = usersStore.users;

    // Apply search filter
    if (filters.value.search) {
        const query = filters.value.search.toLowerCase();
        results = results.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.company && user.company.toLowerCase().includes(query))
        );
    }

    // Apply status filter
    if (filters.value.status) {
        results = results.filter(user => user.status === filters.value.status);
    }

    // Apply company filter
    if (filters.value.company) {
        results = results.filter(user => user.company === filters.value.company);
    }

    // Apply locked filter
    if (filters.value.locked) {
        const isLocked = filters.value.locked === 'true';
        results = results.filter(user => user.is_locked === isLocked);
    }

    return results;
});

onMounted(async () => {
    await loadUsers();
});

const loadUsers = async () => {
    try {
        await usersStore.fetchUsers();
    } catch (error) {
        showMessage('Failed to load users.', 'error');
    }
};

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'active': return 'badge-outline-success';
        case 'inactive': return 'badge-outline-danger';
        case 'pending': return 'badge-outline-warning';
        default: return 'badge-outline-secondary';
    }
};

const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const getFailedAttemptsClass = (attempts: number) => {
    if (attempts === 0) return 'text-success font-semibold';
    if (attempts >= 3) return 'text-danger font-semibold';
    return 'text-warning font-semibold';
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

const openCreateUserModal = () => {
    selectedUser.value = null;
    isCreateMode.value = true;
    showUserModal.value = true;
};

const viewUser = (user: User) => {
    const rolesList = user.roles && user.roles.length > 0 
        ? user.roles.map(r => r.display_name || r.name).join(', ')
        : 'No roles assigned';
    
    const userAny = user as any;
    
    Swal.fire({
        title: user.name,
        html: `
            <div class="space-y-4 text-left">
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Contact Information</h4>
                    <div class="space-y-1">
                        <div><strong>Email:</strong> ${user.email}</div>
                        ${user.phone ? `<div><strong>Phone:</strong> ${user.phone}</div>` : ''}
                        ${user.company ? `<div><strong>Company:</strong> ${user.company}</div>` : ''}
                        ${userAny.job_title ? `<div><strong>Job Title:</strong> ${userAny.job_title}</div>` : ''}
                        ${userAny.department ? `<div><strong>Department:</strong> ${userAny.department}</div>` : ''}
                    </div>
                </div>

                ${userAny.street_address || userAny.city || userAny.zip_code || userAny.country ? `
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Address Information</h4>
                    <div class="space-y-1">
                        ${userAny.street_address ? `<div><strong>Street:</strong> ${userAny.street_address}</div>` : ''}
                        ${userAny.city ? `<div><strong>City:</strong> ${userAny.city}${userAny.zip_code ? ', ' + userAny.zip_code : ''}</div>` : ''}
                        ${userAny.country ? `<div><strong>Country:</strong> ${userAny.country}</div>` : ''}
                    </div>
                </div>
                ` : ''}

                ${userAny.date_of_birth || userAny.gender ? `
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Personal Information</h4>
                    <div class="space-y-1">
                        ${userAny.date_of_birth ? `<div><strong>Date of Birth:</strong> ${userAny.date_of_birth}</div>` : ''}
                        ${userAny.gender ? `<div><strong>Gender:</strong> ${userAny.gender.charAt(0).toUpperCase() + userAny.gender.slice(1).replace('_', ' ')}</div>` : ''}
                    </div>
                </div>
                ` : ''}
                
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Account Status</h4>
                    <div class="space-y-1">
                        <div><strong>Status:</strong> <span class="inline-block px-2 py-1 text-xs rounded ${getStatusBadgeClass(user.status)}">${getStatusLabel(user.status)}</span></div>
                        <div><strong>Account:</strong> ${user.is_locked ? '<span class="text-red-600 font-medium">🔒 Locked</span>' : '<span class="text-green-600 font-medium">🔓 Unlocked</span>'}</div>
                        <div><strong>2FA:</strong> ${user.two_factor_enabled ? '<span class="text-green-600 font-medium">✓ Enabled</span>' : '<span class="text-gray-500">✗ Disabled</span>'}</div>
                        <div><strong>Failed Login Attempts:</strong> <span class="${getFailedAttemptsClass(user.failed_login_attempts)}">${user.failed_login_attempts}</span></div>
                    </div>
                </div>
                
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Roles & Permissions</h4>
                    <div class="space-y-1">
                        <div><strong>Assigned Roles:</strong></div>
                        <div class="ml-4">${rolesList}</div>
                        ${user.permissions && user.permissions.length > 0 ? `
                            <div class="mt-2"><strong>Direct Permissions:</strong></div>
                            <div class="ml-4">${user.permissions.map(p => p.display_name || p.name).join(', ')}</div>
                        ` : ''}
                    </div>
                </div>

                ${userAny.bio ? `
                <div class="border-b pb-3">
                    <h4 class="font-semibold mb-2 text-gray-700">Bio / Notes</h4>
                    <div class="text-sm">${userAny.bio}</div>
                </div>
                ` : ''}
                
                <div>
                    <h4 class="font-semibold mb-2 text-gray-700">Activity & Timestamps</h4>
                    <div class="space-y-1">
                        ${user.last_login_at ? `
                            <div><strong>Last Login:</strong> ${formatDate(user.last_login_at)}</div>
                            <div class="ml-4 text-sm text-gray-500">${getTimeAgo(user.last_login_at)}</div>
                        ` : '<div><strong>Last Login:</strong> <span class="text-gray-500">Never</span></div>'}
                        
                        <div class="mt-2"><strong>Account Created:</strong> ${formatDate(user.created_at)}</div>
                        <div class="ml-4 text-sm text-gray-500">${getTimeAgo(user.created_at)}</div>
                        
                        <div class="mt-2"><strong>Last Updated:</strong> ${formatDate(user.updated_at)}</div>
                        <div class="ml-4 text-sm text-gray-500">${getTimeAgo(user.updated_at)}</div>
                        
                        ${user.email_verified_at ? `
                            <div class="mt-2"><strong>Email Verified:</strong> ${formatDate(user.email_verified_at)}</div>
                            <div class="ml-4 text-sm text-gray-500">${getTimeAgo(user.email_verified_at)}</div>
                        ` : '<div class="mt-2"><strong>Email Verified:</strong> <span class="text-red-600">Not verified</span></div>'}
                    </div>
                </div>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Close',
        customClass: { 
            container: 'sweet-alerts',
            popup: 'swal2-popup-large'
        },
        width: '700px',
    });
};

const editUser = (user: User) => {
    selectedUser.value = { ...user };
    isCreateMode.value = false;
    showUserModal.value = true;
};

const closeUserModal = () => {
    showUserModal.value = false;
    selectedUser.value = null;
    isCreateMode.value = false;
};

const handleUserSave = async (userData: any) => {
    try {
        if (isCreateMode.value) {
            await usersStore.createUser(userData);
            showMessage('User created successfully.');
        } else if (selectedUser.value) {
            await usersStore.updateUser(selectedUser.value.uuid, userData);
            showMessage('User updated successfully.');
        }
        closeUserModal();
    } catch (error: any) {
        console.error('Save user error:', error);
        showMessage(error?.message || 'Failed to save user.', 'error');
    }
};

const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    const result = await Swal.fire({
        icon: 'warning',
        title: `Change User Status?`,
        text: `Are you sure you want to ${action} "${user.name}"?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}!`,
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            await usersStore.updateUserStatus(user.uuid, newStatus);
            showMessage(`User ${action}d successfully.`);
        } catch (error) {
            showMessage(`Failed to ${action} user.`, 'error');
        }
    }
};

const toggleAccountLock = async (user: User) => {
    const action = user.is_locked ? 'unlock' : 'lock';
    const result = await Swal.fire({
        icon: 'warning',
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Account?`,
        text: `Are you sure you want to ${action} the account for "${user.name}"?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}!`,
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            if (user.is_locked) {
                await usersStore.unlockAccount(user.uuid);
                showMessage('Account unlocked successfully.');
            } else {
                await usersStore.lockAccount(user.uuid);
                showMessage('Account locked successfully.');
            }
        } catch (error: any) {
            console.error('Lock/unlock error:', error);
            showMessage(error?.message || `Failed to ${action} account.`, 'error');
        }
    }
};

const resetFailedAttempts = async (user: User) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Reset Failed Attempts?',
        text: `Are you sure you want to reset failed login attempts for "${user.name}"?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, reset!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            await usersStore.resetFailedLoginAttempts(user.uuid);
            showMessage('Failed attempts reset successfully.');
        } catch (error) {
            showMessage('Failed to reset failed attempts.', 'error');
        }
    }
};

const manageUser2FA = async (user: User) => {
    const action = user.two_factor_enabled ? 'disable' : 'enable';
    const result = await Swal.fire({
        icon: 'warning',
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} 2FA?`,
        text: `Are you sure you want to ${action} 2FA for "${user.name}"?`,
        showCancelButton: true,
        confirmButtonText: `Yes, ${action}!`,
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            if (user.two_factor_enabled) {
                await usersStore.disableUser2FA(user.uuid);
                showMessage('2FA disabled successfully.');
            } else {
                await usersStore.enableUser2FA(user.uuid);
                showMessage('2FA enabled successfully.');
            }
        } catch (error: any) {
            console.error('2FA error:', error);
            showMessage(error?.message || `Failed to ${action} 2FA.`, 'error');
        }
    }
};

const viewUserSessions = (user: User) => {
    router.push(`/users/${user.uuid}/sessions`);
};

const manageUserRoles = (user: User) => {
    router.push(`/users/${user.uuid}/roles`);
};

const terminateUserSessions = async (user: User) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Terminate All Sessions?',
        text: `Are you sure you want to terminate all sessions for "${user.name}"? This will log them out from all devices.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, terminate!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            await usersStore.terminateAllUserSessions(user.uuid);
            showMessage('All user sessions terminated successfully.');
        } catch (error: any) {
            console.error('Terminate sessions error:', error);
            showMessage(error?.message || 'Failed to terminate user sessions.', 'error');
        }
    }
};

const deleteUser = async (user: User) => {
    const result = await Swal.fire({
        icon: 'error',
        title: 'Delete User?',
        text: `Are you sure you want to delete "${user.name}"? This action cannot be undone!`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            await usersStore.deleteUser(user.uuid);
            showMessage('User deleted successfully.');
        } catch (error) {
            showMessage('Failed to delete user.', 'error');
        }
    }
};

const showMessage = (msg = '', type = 'success') => {
    const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Custom SweetAlert styles for better user details view */
:global(.swal2-popup-large) {
    font-size: 14px !important;
}

:global(.swal2-popup-large .swal2-html-container) {
    max-height: 500px !important;
    overflow-y: auto !important;
    text-align: left !important;
}
</style>
