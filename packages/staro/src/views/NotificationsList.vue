<template>
    <div class="mb-6">
        <notifications-header
            title="Notifications Management"
            subtitle="Create, schedule, and send notifications to your users"
            :show-filters-button="true"
            @clear-filters="clearFilters"
        >
            <template #actions>
                <router-link to="/notifications/lists" class="btn btn-outline-primary">
                    <icon-list class="ltr:mr-2 rtl:ml-2" />
                    Manage Lists
                </router-link>
                <router-link to="/notifications/create" class="btn btn-primary">
                    <icon-plus class="ltr:mr-2 rtl:ml-2" />
                    Create Notification
                </router-link>
            </template>

            <template #filters>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Search</label>
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            class="form-input"
                            v-model="filters.search"
                        />
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Status</label>
                        <select class="form-select" v-model="filters.status">
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="sending">Sending</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <!-- Channel Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Channel</label>
                        <select class="form-select" v-model="filters.channel">
                            <option value="">All Channels</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="push">Push</option>
                        </select>
                    </div>

                    <!-- Date Range -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Date From</label>
                        <input
                            type="date"
                            class="form-input"
                            v-model="filters.date_from"
                        />
                    </div>
                </div>
            </template>
        </notifications-header>

        <!-- Statistics -->
        <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-bell class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats.total_notifications }}</h3>
                        <p class="text-white-dark text-sm">Total Notifications</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-send class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats.sent_notifications }}</h3>
                        <p class="text-white-dark text-sm">Sent</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                            <icon-users class="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats.total_recipients }}</h3>
                        <p class="text-white-dark text-sm">Recipients</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <icon-chart class="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ (stats.open_rate * 100).toFixed(1) }}%</h3>
                        <p class="text-white-dark text-sm">Open Rate</p>
                    </div>
                </div>
            </div>
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

        <!-- Notifications List -->
        <div v-else-if="hasNotifications" class="space-y-4">
            <NotificationCard
                v-for="notification in notifications"
                :key="notification.id"
                :notification="notification"
                @edit="handleEdit"
                @delete="handleDelete"
                @view="handleView"
                @send="handleSend"
                @schedule="handleSchedule"
                @cancel="handleCancel"
            />

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
                <div class="flex flex-1 justify-between sm:hidden">
                    <button
                        @click="previousPage"
                        :disabled="pagination.current_page === 1"
                        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        @click="nextPage"
                        :disabled="pagination.current_page === pagination.last_page"
                        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Showing
                            <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
                            to
                            <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
                            of
                            <span class="font-medium">{{ pagination.total }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <button
                                @click="previousPage"
                                :disabled="pagination.current_page === 1"
                                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="goToPage(page)"
                                :class="[
                                    page === pagination.current_page
                                        ? 'relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                        : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                ]"
                            >
                                {{ page }}
                            </button>
                            <button
                                @click="nextPage"
                                :disabled="pagination.current_page === pagination.last_page"
                                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <IconBell class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new notification.</p>
            <div class="mt-6">
                <router-link
                    to="/notifications/create"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                    <IconBell class="-ml-1 mr-2 h-5 w-5" />
                    Create Notification
                </router-link>
            </div>
        </div>

        <!-- Modals -->
        <NotificationModal
            v-if="showModal"
            :notification="selectedNotification"
            :mode="modalMode"
            @close="closeModal"
            @confirm="handleModalConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useNotificationsStore } from '../stores/notifications';
import type { Notification } from '../stores/notifications';

// Components
import NotificationsHeader from '../components/NotificationsHeader.vue';
import NotificationCard from '../components/NotificationCard.vue';
import NotificationModal from '../components/NotificationModal.vue';

// Icons
import IconBell from '../components/icon/icon-bell.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconChart from '../components/icon/icon-chart.vue';
import IconList from '../components/icon/icon-list.vue';
import IconPlus from '../components/icon/icon-plus.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();

// Reactive data
const filters = reactive({
    search: '',
    status: '',
    channel: '',
    date_from: '',
    date_to: ''
});

const showModal = ref(false);
const selectedNotification = ref<Notification | null>(null);
const modalMode = ref<'delete' | 'send' | 'cancel'>('delete');
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// Computed
const {
    notifications,
    loading,
    error,
    pagination,
    hasNotifications,
} = storeToRefs(notificationsStore);

const stats = computed(() => notificationsStore.statistics);

const visiblePages = computed(() => {
    const current = pagination.value.current_page;
    const last = pagination.value.last_page;
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
        range.push(i);
    }

    if (current - delta > 2) {
        rangeWithDots.push(1, '...');
    } else {
        rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < last - 1) {
        rangeWithDots.push('...', last);
    } else {
        rangeWithDots.push(last);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
});

// Methods
const loadData = async () => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
    );
    await Promise.all([
        notificationsStore.fetchNotifications(cleanFilters),
        notificationsStore.fetchStatistics(),
    ]);
};

const clearFilters = () => {
    filters.search = '';
    filters.status = '';
    filters.channel = '';
    filters.date_from = '';
    filters.date_to = '';
    loadData();
};

const handleEdit = (notification: Notification) => {
    router.push(`/notifications/${notification.id}/edit`);
};

const handleView = (notification: Notification) => {
    router.push(`/notifications/${notification.id}`);
};

const handleDelete = (notification: Notification) => {
    selectedNotification.value = notification;
    modalMode.value = 'delete';
    showModal.value = true;
};

const handleSend = (notification: Notification) => {
    selectedNotification.value = notification;
    modalMode.value = 'send';
    showModal.value = true;
};

const handleSchedule = (notification: Notification) => {
    router.push(`/notifications/${notification.id}/edit`);
};

const handleCancel = (notification: Notification) => {
    selectedNotification.value = notification;
    modalMode.value = 'cancel';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedNotification.value = null;
};

const handleModalConfirm = async () => {
    if (!selectedNotification.value) return;

    try {
        switch (modalMode.value) {
            case 'delete':
                await notificationsStore.deleteNotification(selectedNotification.value.id);
                break;
            case 'send':
                await notificationsStore.sendNotification(selectedNotification.value.id);
                break;
            case 'cancel':
                await notificationsStore.cancelNotification(selectedNotification.value.id);
                break;
        }
        closeModal();
    } catch (err) {
        console.error('Modal action failed:', err);
    }
};

const goToPage = async (page: number | string) => {
    if (typeof page === 'string') return;
    await notificationsStore.fetchNotifications(filters, page);
};

const previousPage = async () => {
    if (pagination.value.current_page > 1) {
        await goToPage(pagination.value.current_page - 1);
    }
};

const nextPage = async () => {
    if (pagination.value.current_page < pagination.value.last_page) {
        await goToPage(pagination.value.current_page + 1);
    }
};

const startAutoRefresh = () => {
    refreshInterval.value = setInterval(() => {
        loadData();
    }, 30000); // Refresh every 30 seconds
};

const stopAutoRefresh = () => {
    if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
        refreshInterval.value = null;
    }
};

// Lifecycle
onMounted(() => {
    loadData();
    startAutoRefresh();
});

onUnmounted(() => {
    stopAutoRefresh();
});
</script>
