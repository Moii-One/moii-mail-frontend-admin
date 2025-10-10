<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
                <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search
                </label>
                <input
                    id="search"
                    v-model="filters.search"
                    type="text"
                    placeholder="Search notifications..."
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
            </div>

            <!-- Status -->
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                </label>
                <select
                    id="status"
                    v-model="filters.status"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <!-- Channel -->
            <div>
                <label for="channel" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Channel
                </label>
                <select
                    id="channel"
                    v-model="filters.channel"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="">All Channels</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                </select>
            </div>

            <!-- Date Range -->
            <div>
                <label for="date_from" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date From
                </label>
                <input
                    id="date_from"
                    v-model="filters.date_from"
                    type="date"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
            </div>

            <!-- Date To -->
            <div class="md:col-start-4 lg:col-start-auto">
                <label for="date_to" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date To
                </label>
                <input
                    id="date_to"
                    v-model="filters.date_to"
                    type="date"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
            </div>

            <!-- Sort By -->
            <div>
                <label for="sort_by" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                </label>
                <select
                    id="sort_by"
                    v-model="filters.sort_by"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="created_at">Created Date</option>
                    <option value="updated_at">Updated Date</option>
                    <option value="scheduled_at">Scheduled Date</option>
                    <option value="sent_at">Sent Date</option>
                    <option value="title">Title</option>
                    <option value="recipients_count">Recipients Count</option>
                </select>
            </div>

            <!-- Sort Direction -->
            <div>
                <label for="sort_direction" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort Direction
                </label>
                <select
                    id="sort_direction"
                    v-model="filters.sort_direction"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>

            <!-- Actions -->
            <div class="lg:col-span-2 flex items-end space-x-3">
                <button
                    @click="applyFilters"
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Apply Filters
                </button>
                <button
                    @click="resetFilters"
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Reset
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Filters {
    search: string;
    status: string;
    channel: string;
    date_from: string;
    date_to: string;
    sort_by: string;
    sort_direction: string;
}

const emit = defineEmits<{
    filter: [filters: Record<string, string>];
}>();

// Reactive data
const filters = ref<Filters>({
    search: '',
    status: '',
    channel: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
});

// Methods
const applyFilters = () => {
    // Remove empty values
    const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value !== '')
    );
    emit('filter', cleanFilters);
};

const resetFilters = () => {
    filters.value = {
        search: '',
        status: '',
        channel: '',
        date_from: '',
        date_to: '',
        sort_by: 'created_at',
        sort_direction: 'desc',
    };
    applyFilters();
};

// Auto-apply filters when search changes (debounced)
let searchTimeout: NodeJS.Timeout;
watch(() => filters.value.search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters();
    }, 500);
});

// Auto-apply filters when other fields change
watch([
    () => filters.value.status,
    () => filters.value.channel,
    () => filters.value.date_from,
    () => filters.value.date_to,
    () => filters.value.sort_by,
    () => filters.value.sort_direction,
], () => {
    applyFilters();
});
</script>
