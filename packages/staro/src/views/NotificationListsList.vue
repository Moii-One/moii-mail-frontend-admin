<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Notification Lists</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Manage user groups for targeted notifications
                </p>
            </div>
            <router-link
                to="/notifications/lists/create"
                class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm"
            >
                <IconList class="w-4 h-4 mr-2" />
                Create List
            </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
                <IconX class="h-5 w-5 text-red-400 mr-2" />
                <div class="text-sm text-red-800 dark:text-red-200">{{ error }}</div>
            </div>
        </div>

        <!-- Lists -->
        <div v-else-if="hasLists" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="list in lists"
                :key="list.id"
                class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {{ list.name }}
                        </h3>
                        <p v-if="list.description" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {{ list.description }}
                        </p>
                        <div class="flex items-center mt-3">
                            <IconUsers class="h-4 w-4 text-gray-400 mr-1" />
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                {{ list.user_count }} users
                            </span>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Created {{ formatDate(list.created_at) }}
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                        <router-link
                            :to="`/notifications/lists/${list.id}`"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="View list"
                        >
                            <IconEye class="h-4 w-4" />
                        </router-link>
                        <router-link
                            :to="`/notifications/lists/${list.id}/edit`"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Edit list"
                        >
                            <IconEdit class="h-4 w-4" />
                        </router-link>
                        <button
                            @click="handleDelete(list)"
                            class="p-2 text-red-400 hover:text-red-600"
                            title="Delete list"
                        >
                            <IconTrash class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <IconList class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notification lists</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new notification list.</p>
            <div class="mt-6">
                <router-link
                    to="/notifications/lists/create"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                    <IconList class="-ml-1 mr-2 h-5 w-5" />
                    Create List
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationListsStore } from '../stores/notificationLists';
import type { NotificationList } from '../stores/notificationLists';

// Icons
import IconList from '../components/icon/icon-list.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconX from '../components/icon/icon-x.vue';

const listsStore = useNotificationListsStore();

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const { lists, hasLists } = storeToRefs(listsStore);

// Methods
const loadLists = async () => {
    loading.value = true;
    error.value = null;

    try {
        await listsStore.fetchLists();
    } catch (err) {
        error.value = 'Failed to load notification lists';
        console.error('Error loading lists:', err);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async (list: NotificationList) => {
    if (confirm(`Are you sure you want to delete "${list.name}"?`)) {
        try {
            await listsStore.deleteList(list.id);
        } catch (err) {
            console.error('Error deleting list:', err);
        }
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Lifecycle
onMounted(() => {
    loadLists();
});
</script>
