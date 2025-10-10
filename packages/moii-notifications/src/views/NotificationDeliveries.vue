<template>
    <div>
        <NotificationsHeader
            title="Delivery Reports"
            :show-filters="true"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-send class="w-8 h-8 text-primary" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ totalDeliveries }}</h3>
                        <p class="text-white-dark text-sm">Total Deliveries</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-check class="w-8 h-8 text-success" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ deliveredCount }}</h3>
                        <p class="text-white-dark text-sm">Delivered</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-eye class="w-8 h-8 text-info" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ openedCount }}</h3>
                        <p class="text-white-dark text-sm">Opened</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-x class="w-8 h-8 text-danger" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ failedCount }}</h3>
                        <p class="text-white-dark text-sm">Failed</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Deliveries Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="deliveries"
                    :columns="cols"
                    :loading="loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                >
                    <template #notification_title="data">
                        <div class="max-w-xs truncate">
                            <div class="font-semibold">{{ data.value }}</div>
                        </div>
                    </template>

                    <template #recipient="data">
                        <div class="text-sm">
                            <div v-if="data.value.email">{{ data.value.email }}</div>
                            <div v-if="data.value.phone" class="text-gray-500">{{ data.value.phone }}</div>
                            <div v-if="!data.value.email && !data.value.phone" class="text-gray-500">
                                User ID: {{ data.value.recipient_id }}
                            </div>
                        </div>
                    </template>

                    <template #status="data">
                        <span
                            class="badge"
                            :class="getStatusBadgeClass(data.value)"
                        >
                            {{ getStatusLabel(data.value) }}
                        </span>
                    </template>

                    <template #sent_at="data">
                        <div class="text-sm">
                            {{ data.value ? formatDate(data.value) : '-' }}
                        </div>
                    </template>

                    <template #delivered_at="data">
                        <div class="text-sm">
                            {{ data.value ? formatDate(data.value) : '-' }}
                        </div>
                    </template>

                    <template #actions="data">
                        <div class="flex items-center gap-2">
                            <button
                                v-if="data.value.status === 'failed'"
                                @click="showErrorDetails(data.value)"
                                class="text-warning hover:text-warning-dark"
                                title="View Error"
                            >
                                <icon-alert-triangle class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- Error Details Modal -->
        <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Delivery Error</h3>
                    <button
                        @click="showErrorModal = false"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <icon-x class="w-6 h-6" />
                    </button>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="text-sm font-medium text-gray-500">Error Message</label>
                        <div class="mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                            <p class="text-sm text-red-700 dark:text-red-300">
                                {{ selectedDelivery?.error_message || 'No error message available' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            @click="showErrorModal = false"
                            class="btn btn-primary"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotificationsStore, type NotificationDelivery } from '../stores/notifications';
import NotificationsHeader from '../components/NotificationsHeader.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconCheck from '../components/icon/icon-check.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconX from '../components/icon/icon-x.vue';
import IconAlertTriangle from '../components/icon/icon-alert-triangle.vue';

const notificationsStore = useNotificationsStore();

const deliveries = computed(() => notificationsStore.deliveries);
const loading = ref(false);
const showErrorModal = ref(false);
const selectedDelivery = ref<NotificationDelivery | null>(null);

const totalDeliveries = computed(() => deliveries.value.length);
const deliveredCount = computed(() => deliveries.value.filter(d => d.status === 'delivered').length);
const openedCount = computed(() => deliveries.value.filter(d => d.opened_at).length);
const failedCount = computed(() => deliveries.value.filter(d => d.status === 'failed').length);

const cols = [
    { field: 'notification_title', title: 'Notification', sort: true },
    { field: 'recipient', title: 'Recipient' },
    { field: 'status', title: 'Status' },
    { field: 'sent_at', title: 'Sent', sort: true },
    { field: 'delivered_at', title: 'Delivered', sort: true },
    { field: 'actions', title: 'Actions', width: '100px' },
];

const getStatusLabel = (status: string) => {
    const labels = {
        pending: 'Pending',
        sent: 'Sent',
        delivered: 'Delivered',
        failed: 'Failed',
        bounced: 'Bounced',
    };
    return labels[status as keyof typeof labels] || status;
};

const getStatusBadgeClass = (status: string) => {
    const classes = {
        pending: 'badge-outline-secondary',
        sent: 'badge-outline-info',
        delivered: 'badge-outline-success',
        failed: 'badge-outline-danger',
        bounced: 'badge-outline-warning',
    };
    return classes[status as keyof typeof classes] || 'badge-outline-secondary';
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const showErrorDetails = (delivery: NotificationDelivery) => {
    selectedDelivery.value = delivery;
    showErrorModal.value = true;
};

const loadDeliveries = async () => {
    loading.value = true;
    try {
        await notificationsStore.fetchDeliveries();
    } catch (error) {
        console.error('Error loading deliveries:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadDeliveries();
});
</script>
