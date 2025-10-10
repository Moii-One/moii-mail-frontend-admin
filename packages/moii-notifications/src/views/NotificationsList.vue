<template>
    <div>
        <NotificationsHeader
            title="Notifications"
            v-model="filters"
            @add="openCreateModal"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-notifications class="w-8 h-8 text-primary" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ notificationsStore.notifications.length }}</h3>
                        <p class="text-white-dark text-sm">Total Notifications</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-draft class="w-8 h-8 text-secondary" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ notificationsStore.draftNotifications.length }}</h3>
                        <p class="text-white-dark text-sm">Draft</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-schedule class="w-8 h-8 text-info" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ notificationsStore.scheduledNotifications.length }}</h3>
                        <p class="text-white-dark text-sm">Scheduled</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-send class="w-8 h-8 text-success" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ notificationsStore.sentNotifications.length }}</h3>
                        <p class="text-white-dark text-sm">Sent</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notifications Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="notificationsStore.notifications.length > 0 || notificationsStore.loading">
                <vue3-datatable
                    :rows="filteredNotifications"
                    :columns="cols"
                    :totalRows="notificationsStore.pagination.total"
                    :loading="notificationsStore.loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    @page-change="handlePageChange"
                >
                    <template #title="data">
                        <div class="max-w-xs truncate">
                            <div class="font-semibold">{{ data.value.title }}</div>
                        </div>
                    </template>

                    <template #excerpt="data">
                        <div class="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400" :title="data.value.excerpt">
                            {{ data.value.excerpt || '-' }}
                        </div>
                    </template>

                    <template #channels="data">
                        <div class="flex flex-wrap gap-1">
                            <span
                                v-for="channel in data.value.channels"
                                :key="channel"
                                class="badge badge-outline-primary text-xs"
                            >
                                {{ getChannelLabel(channel) }}
                            </span>
                        </div>
                    </template>

                    <template #status="data">
                        <span
                            class="badge"
                            :class="getStatusBadgeClass(data.value.status)"
                        >
                            {{ getStatusLabel(data.value.status) }}
                        </span>
                    </template>

                    <template #total_recipients="data">
                        <div class="text-sm">
                            {{ data.value.total_recipients || 0 }}
                        </div>
                    </template>

                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>

                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="router.push(`/notifications/${data.value.id}`)"
                                title="View"
                            >
                                <icon-eye class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm"
                                @click="router.push(`/notifications/${data.value.id}/edit`)"
                                title="Edit"
                            >
                                <icon-edit class="w-3 h-3" />
                            </button>
                            <button
                                v-if="data.value.status === 'draft'"
                                type="button"
                                class="btn btn-outline-success btn-sm"
                                @click="sendNotification(data.value)"
                                title="Send Now"
                            >
                                <icon-send class="w-3 h-3" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="deleteNotification(data.value)"
                                title="Delete"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No notifications found
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationsStore, type Notification } from '../stores/notifications';
import useNotificationChannels from '../composables/useNotificationChannels';
import NotificationsHeader from '../components/NotificationsHeader.vue';
import IconNotifications from '../components/icon/icon-notifications.vue';
import IconDraft from '../components/icon/icon-draft.vue';
import IconSchedule from '../components/icon/icon-schedule.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import Swal from 'sweetalert2';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const { getChannelLabel } = useNotificationChannels();

const filters = reactive({
    search: '',
    status: '',
    channel: '',
    type: '',
});

const cols = [
    { field: 'title', title: 'Title', sort: true },
    { field: 'excerpt', title: 'Excerpt' },
    { field: 'channels', title: 'Channels' },
    { field: 'status', title: 'Status' },
    { field: 'total_recipients', title: 'Recipients', sort: true },
    { field: 'created_at', title: 'Created', sort: true },
    { field: 'actions', title: 'Actions', width: '150px', isUnique: true, sort: false },
];

const filteredNotifications = computed(() => {
    let notifications = notificationsStore.notifications;

    if (filters.search) {
        notifications = notifications.filter(n =>
            n.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            n.content.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    if (filters.status) {
        notifications = notifications.filter(n => n.status === filters.status);
    }

    if (filters.channel) {
        notifications = notifications.filter(n =>
            n.channels.includes(filters.channel)
        );
    }

    // Note: type filter not implemented as notifications don't have a type property yet

    return notifications;
});

const getStatusLabel = (status: string) => {
    const labels = {
        draft: 'Draft',
        scheduled: 'Scheduled',
        sending: 'Sending',
        sent: 'Sent',
        failed: 'Failed',
        cancelled: 'Cancelled',
    };
    return labels[status as keyof typeof labels] || status;
};

const getStatusBadgeClass = (status: string) => {
    const classes = {
        draft: 'badge-outline-secondary',
        scheduled: 'badge-outline-info',
        sending: 'badge-outline-warning',
        sent: 'badge-outline-success',
        failed: 'badge-outline-danger',
        cancelled: 'badge-outline-dark',
    };
    return classes[status as keyof typeof classes] || 'badge-outline-secondary';
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

const getTimeAgo = (dateString: string): string => {
    try {
        const now = new Date();
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const openCreateModal = () => {
    router.push('/notifications/create');
};

const handleSearch = (search: string) => {
    filters.search = search;
};

const handleFilter = (filterData: any) => {
    Object.assign(filters, filterData);
};

const handlePageChange = (page: number) => {
    notificationsStore.fetchNotifications({
        ...filters,
        page,
    });
};

const sendNotification = async (notification: Notification) => {
    const result = await Swal.fire({
        title: 'Send Notification?',
        text: `Are you sure you want to send "${notification.title}" now? This will be sent to ${notification.total_recipients || 0} recipients.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00ab55',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, send now',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await notificationsStore.sendNotification(notification.id);
            await notificationsStore.fetchNotifications();
            showMessage('Notification sent successfully.');
        } catch (error: any) {
            console.error('Error sending notification:', error);
            showMessage(error?.message || 'Failed to send notification.', 'error');
        }
    }
};

const scheduleNotification = async (notification: Notification) => {
    const { value: scheduledAt } = await Swal.fire({
        title: 'Schedule Notification',
        html: `
            <input type="datetime-local" id="scheduled-datetime" class="swal2-input" style="width: 80%;">
        `,
        showCancelButton: true,
        confirmButtonColor: '#4361ee',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Schedule',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const datetime = (document.getElementById('scheduled-datetime') as HTMLInputElement).value;
            if (!datetime) {
                Swal.showValidationMessage('Please select a date and time');
                return false;
            }
            return datetime;
        }
    });

    if (scheduledAt) {
        try {
            await notificationsStore.scheduleNotification(notification.id, scheduledAt);
            await notificationsStore.fetchNotifications();
            showMessage('Notification scheduled successfully.');
        } catch (error: any) {
            console.error('Error scheduling notification:', error);
            showMessage(error?.message || 'Failed to schedule notification.', 'error');
        }
    }
};

const deleteNotification = async (notification: Notification) => {
    const result = await Swal.fire({
        title: 'Delete Notification?',
        text: `Are you sure you want to delete "${notification.title}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await notificationsStore.deleteNotification(notification.id);
            showMessage('Notification deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting notification:', error);
            showMessage(error?.message || 'Failed to delete notification.', 'error');
        }
    }
};

const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    toast.fire({
        icon: type,
        title: message,
    });
};

onMounted(async () => {
    await notificationsStore.fetchNotifications();
    await notificationsStore.fetchStatistics();
});
</script>
