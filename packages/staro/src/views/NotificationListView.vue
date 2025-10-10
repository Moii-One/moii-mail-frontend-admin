<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    List Details
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    View and manage notification list users
                </p>
            </div>
            <div class="flex space-x-3">
                <router-link
                    to="/notifications/lists"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Back to Lists
                </router-link>
                <router-link
                    v-if="list"
                    :to="`/notifications/lists/${list.id}/edit`"
                    class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm"
                >
                    <IconEdit class="w-4 h-4 mr-2" />
                    Edit List
                </router-link>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- List Details -->
        <div v-else-if="list" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">List Information</h3>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ list.name }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                User Count
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ list.user_count }} users</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Created
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(list.created_at) }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Updated
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(list.updated_at) }}</p>
                        </div>
                    </div>

                    <div v-if="list.description" class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <p class="text-sm text-gray-900 dark:text-white">{{ list.description }}</p>
                    </div>
                </div>
            </div>

            <!-- Users (placeholder for future implementation) -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Users in this List</h3>
                </div>
                
                <div class="p-6">
                    <div class="text-center py-8">
                        <IconUsers class="mx-auto h-12 w-12 text-gray-400" />
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">User management</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            User management functionality will be available in a future update.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
                <IconX class="h-5 w-5 text-red-400 mr-2" />
                <div class="text-sm text-red-800 dark:text-red-200">{{ error }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotificationListsStore } from '../stores/notificationLists';

// Icons
import IconEdit from '../components/icon/icon-edit.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconX from '../components/icon/icon-x.vue';

const route = useRoute();
const listsStore = useNotificationListsStore();

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const list = computed(() => listsStore.currentList);

// Methods
const loadList = async () => {
    const id = parseInt(route.params.id as string);
    if (!id) return;

    loading.value = true;
    error.value = null;

    try {
        await listsStore.fetchList(id);
        if (!list.value) {
            error.value = 'Notification list not found';
        }
    } catch (err) {
        error.value = 'Failed to load notification list';
        console.error('Error loading list:', err);
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Lifecycle
onMounted(() => {
    loadList();
});
</script>
