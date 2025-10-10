<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ isEdit ? 'Edit Notification List' : 'Create Notification List' }}
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ isEdit ? 'Update notification list details' : 'Create a new notification list for organizing users' }}
                </p>
            </div>
            <router-link
                to="/notifications/lists"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                Back to Lists
            </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">List Details</h3>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            v-model="form.name"
                            type="text"
                            required
                            placeholder="Enter list name"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            rows="3"
                            placeholder="Enter list description"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        ></textarea>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
                <router-link
                    to="/notifications/lists"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Cancel
                </router-link>
                
                <button
                    type="submit"
                    :disabled="loading || !form.name"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    <span v-if="loading" class="mr-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </span>
                    {{ isEdit ? 'Update List' : 'Create List' }}
                </button>
            </div>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
                <IconX class="h-5 w-5 text-red-400 mr-2" />
                <div class="text-sm text-red-800 dark:text-red-200">{{ error }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationListsStore } from '../stores/notificationLists';
import type { CreateListData, UpdateListData } from '../stores/notificationLists';

// Icons
import IconX from '../components/icon/icon-x.vue';

const route = useRoute();
const router = useRouter();
const listsStore = useNotificationListsStore();

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref<CreateListData & { id?: number }>({
    name: '',
    description: '',
});

// Computed
const isEdit = computed(() => !!route.params.id);

// Methods
const loadList = async () => {
    if (!isEdit.value) return;
    
    const id = parseInt(route.params.id as string);
    loading.value = true;
    error.value = null;

    try {
        const list = await listsStore.fetchList(id);
        if (list) {
            form.value = {
                id: list.id,
                name: list.name,
                description: list.description || '',
            };
        }
    } catch (err) {
        error.value = 'Failed to load notification list';
        console.error('Error loading list:', err);
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async () => {
    if (!form.value.name) return;

    loading.value = true;
    error.value = null;

    try {
        if (isEdit.value && form.value.id) {
            const data: UpdateListData = {
                name: form.value.name,
                description: form.value.description || undefined,
            };
            await listsStore.updateList(form.value.id, data);
        } else {
            const data: CreateListData = {
                name: form.value.name,
                description: form.value.description || undefined,
            };
            await listsStore.createList(data);
        }

        router.push('/notifications/lists');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to save notification list';
    } finally {
        loading.value = false;
    }
};

// Lifecycle
onMounted(() => {
    loadList();
});
</script>
