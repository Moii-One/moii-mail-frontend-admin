<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Notification Deliveries</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    View delivery status and analytics for all notifications
                </p>
            </div>
            <router-link
                to="/notifications"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                Back to Notifications
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

        <!-- Deliveries Content -->
        <div v-else class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <IconSend class="h-6 w-6 text-blue-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Total Deliveries
                                    </dt>
                                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                                        {{ deliveries.length }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <IconCheck class="h-6 w-6 text-green-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Successful
                                    </dt>
                                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                                        {{ successfulDeliveries.length }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <IconX class="h-6 w-6 text-red-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Failed
                                    </dt>
                                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                                        {{ failedDeliveries.length }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <IconSchedule class="h-6 w-6 text-yellow-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Pending
                                    </dt>
                                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                                        {{ pendingDeliveries.length }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Placeholder Content -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delivery Details</h3>
                </div>
                
                <div class="p-6">
                    <div class="text-center py-8">
                        <IconChart class="mx-auto h-12 w-12 text-gray-400" />
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Delivery Analytics</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Detailed delivery analytics and reporting will be available in a future update.
                        </p>
                        <p class="mt-2 text-xs text-gray-400">
                            Features coming soon: Delivery tracking, open rates, click-through rates, bounce analysis, and delivery timeline.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationDeliveriesStore } from '../stores/deliveries';

// Icons
import IconSend from '../components/icon/icon-send.vue';
import IconCheck from '../components/icon/icon-check.vue';
import IconX from '../components/icon/icon-x.vue';
import IconSchedule from '../components/icon/icon-schedule.vue';
import IconChart from '../components/icon/icon-chart.vue';

const deliveriesStore = useNotificationDeliveriesStore();

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const {
    deliveries,
    successfulDeliveries,
    failedDeliveries,
    pendingDeliveries,
} = storeToRefs(deliveriesStore);

// Methods
const loadDeliveries = async () => {
    loading.value = true;
    error.value = null;

    try {
        await deliveriesStore.fetchDeliveries();
    } catch (err) {
        error.value = 'Failed to load deliveries';
        console.error('Error loading deliveries:', err);
    } finally {
        loading.value = false;
    }
};

// Lifecycle
onMounted(() => {
    loadDeliveries();
});
</script>
