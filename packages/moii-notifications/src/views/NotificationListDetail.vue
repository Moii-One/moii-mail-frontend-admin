<template>
    <div v-if="list">
        <div class="flex items-center gap-4 mb-6">
            <router-link
                to="/notification-lists"
                class="btn btn-outline-secondary flex items-center gap-2"
            >
                <icon-arrow-left class="w-4 h-4" />
                Back to Lists
            </router-link>
            <h1 class="text-2xl font-bold">{{ list.name }}</h1>
            <div class="ml-auto flex items-center gap-2">
                <router-link
                    :to="`/notification-lists/${list.id}/edit`"
                    class="btn btn-warning flex items-center gap-2"
                >
                    <icon-edit class="w-4 h-4" />
                    Edit
                </router-link>

                <button
                    @click="deleteList"
                    class="btn btn-danger flex items-center gap-2"
                >
                    <icon-trash class="w-4 h-4" />
                    Delete
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- List Description -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Description</h3>
                    <p v-if="list.description" class="text-gray-700 dark:text-gray-300">
                        {{ list.description }}
                    </p>
                    <p v-else class="text-gray-500 italic">
                        No description provided.
                    </p>
                </div>

                <!-- List Type Info -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">List Configuration</h3>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <component
                                :is="list.is_dynamic ? IconFilter : IconList"
                                class="w-5 h-5 text-primary"
                            />
                            <div>
                                <div class="font-medium">
                                    {{ list.is_dynamic ? 'Dynamic List' : 'Manual List' }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ list.is_dynamic ? 'Users are added automatically based on filters' : 'Users are added manually' }}
                                </div>
                            </div>
                        </div>

                        <div v-if="list.is_dynamic && list.filters" class="mt-4">
                            <h4 class="font-medium mb-2">Filters:</h4>
                            <div class="space-y-2">
                                <div
                                    v-for="filter in list.filters"
                                    :key="`${filter.field}-${filter.operator}-${filter.value}`"
                                    class="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
                                >
                                    <span class="font-medium">{{ filter.field }}</span>
                                    <span class="text-gray-500">{{ filter.operator }}</span>
                                    <span class="font-mono bg-white dark:bg-gray-600 px-2 py-1 rounded">{{ filter.value }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Users in List -->
                <div class="panel">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Users in List</h3>
                        <button
                            v-if="!list.is_dynamic"
                            @click="showAddUsers = true"
                            class="btn btn-primary flex items-center gap-2"
                        >
                            <icon-plus class="w-4 h-4" />
                            Add Users
                        </button>
                    </div>

                    <div v-if="users.length > 0" class="space-y-3">
                        <div
                            v-for="user in users"
                            :key="user.uuid"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold text-primary">
                                        {{ user.name.charAt(0).toUpperCase() }}
                                    </span>
                                </div>
                                <div>
                                    <div class="font-medium">{{ user.name }}</div>
                                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <span
                                    class="badge"
                                    :class="user.status === 'active' ? 'badge-outline-success' : 'badge-outline-secondary'"
                                >
                                    {{ user.status }}
                                </span>

                                <button
                                    v-if="!list.is_dynamic"
                                    @click="removeUser(user.uuid)"
                                    class="text-danger hover:text-danger-dark"
                                    title="Remove from list"
                                >
                                    <icon-trash class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-8 text-gray-500">
                        <icon-users class="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No users in this list yet.</p>
                        <button
                            v-if="!list.is_dynamic"
                            @click="showAddUsers = true"
                            class="btn btn-primary mt-4"
                        >
                            Add Users
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- List Stats -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Statistics</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Total Users:</span>
                            <span class="font-semibold">{{ list.users_count }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Active Users:</span>
                            <span class="font-semibold">{{ activeUsersCount }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Inactive Users:</span>
                            <span class="font-semibold">{{ inactiveUsersCount }}</span>
                        </div>
                    </div>
                </div>

                <!-- List Info -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Details</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm font-medium text-gray-500">Created</label>
                            <div class="text-sm">{{ formatDate(list.created_at) }}</div>
                        </div>

                        <div v-if="list.creator">
                            <label class="text-sm font-medium text-gray-500">Created By</label>
                            <div class="text-sm">{{ list.creator.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Users Modal -->
        <div v-if="showAddUsers" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Add Users to List</h3>
                    <button
                        @click="showAddUsers = false"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <icon-x class="w-6 h-6" />
                    </button>
                </div>

                <div class="space-y-4">
                    <select
                        v-model="selectedUserId"
                        class="form-select"
                        @change="addUser"
                    >
                        <option value="">Select a user to add...</option>
                        <option
                            v-for="user in availableUsersForAdd"
                            :key="user.uuid"
                            :value="user.uuid"
                        >
                            {{ user.name }} ({{ user.email }})
                        </option>
                    </select>

                    <div class="flex justify-end gap-2">
                        <button
                            @click="showAddUsers = false"
                            class="btn btn-outline-secondary"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '../../../moii-users/src/stores/users';
import { useNotificationsStore, type NotificationList } from '../stores/notifications';
import IconArrowLeft from '../components/icon/icon-arrow-left.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import IconX from '../components/icon/icon-x.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconFilter from '../components/icon/icon-filter.vue';
import IconList from '../components/icon/icon-list.vue';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const notificationsStore = useNotificationsStore();

const list = ref<NotificationList | null>(null);
const users = ref<any[]>([]);
const showAddUsers = ref(false);
const selectedUserId = ref('');

const activeUsersCount = computed(() => users.value.filter(u => u.status === 'active').length);
const inactiveUsersCount = computed(() => users.value.filter(u => u.status !== 'active').length);

const availableUsersForAdd = computed(() => {
    const existingUserIds = users.value.map(u => u.uuid);
    return usersStore.users.filter(u => !existingUserIds.includes(u.uuid));
});

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const loadList = async () => {
    const id = parseInt(route.params.id as string);
    try {
        await notificationsStore.fetchList(id);
        list.value = notificationsStore.lists.find(l => l.id === id) || null;

        if (list.value) {
            // Load users in the list
            const usersResponse = await notificationsStore.fetchListUsers(list.value.id);
            if (usersResponse.success) {
                users.value = usersResponse.data || [];
            }
        }
    } catch (error) {
        console.error('Error loading list:', error);
    }
};

const deleteList = async () => {
    if (!list.value) return;
    if (confirm('Are you sure you want to delete this list?')) {
        try {
            await notificationsStore.deleteList(list.value.id);
            router.push('/notification-lists');
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    }
};

const addUser = async () => {
    if (!list.value || !selectedUserId.value) return;

    try {
        await notificationsStore.addUsersToList(list.value.id, [selectedUserId.value]);
        selectedUserId.value = '';
        await loadList(); // Reload to get updated user count
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

const removeUser = async (userId: string) => {
    if (!list.value) return;

    try {
        await notificationsStore.removeUsersFromList(list.value.id, [userId]);
        await loadList(); // Reload to get updated user count
    } catch (error) {
        console.error('Error removing user:', error);
    }
};

onMounted(async () => {
    // Load users if not already loaded
    if (usersStore.users.length === 0) {
        await usersStore.fetchUsers();
    }

    await loadList();
});
</script>
