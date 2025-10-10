<template>
    <div v-if="notification">
        <div class="flex items-center gap-4 mb-6">
            <router-link
                to="/notifications"
                class="btn btn-outline-secondary flex items-center gap-2"
            >
                <icon-arrow-left class="w-4 h-4" />
                Back to Notifications
            </router-link>
            <h1 class="text-2xl font-bold">{{ notification.title }}</h1>
            <div class="ml-auto flex items-center gap-2">
                <router-link
                    :to="`/notifications/${notification.id}/edit`"
                    class="btn btn-warning flex items-center gap-2"
                >
                    <icon-edit class="w-4 h-4" />
                    Edit
                </router-link>

                <button
                    v-if="notification.status === 'draft'"
                    @click="sendNotification"
                    class="btn btn-success flex items-center gap-2"
                >
                    <icon-send class="w-4 h-4" />
                    Send Now
                </button>

                <button
                    v-if="notification.status === 'draft'"
                    @click="scheduleNotification"
                    class="btn btn-primary flex items-center gap-2"
                >
                    <icon-schedule class="w-4 h-4" />
                    Schedule
                </button>

                <button
                    @click="deleteNotification"
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
                <!-- Notification Content -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Content</h3>
                    <div v-if="notification.excerpt" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ notification.excerpt }}</p>
                    </div>
                    <div class="prose dark:prose-invert max-w-none" v-html="notification.content"></div>
                </div>

                <!-- Delivery Statistics -->
                <div v-if="deliveryStats" class="panel">
                    <h3 class="text-lg font-semibold mb-4">Delivery Statistics</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-primary">{{ deliveryStats.sent || 0 }}</div>
                            <div class="text-sm text-gray-500">Sent</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-success">{{ deliveryStats.delivered || 0 }}</div>
                            <div class="text-sm text-gray-500">Delivered</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-warning">{{ deliveryStats.opened || 0 }}</div>
                            <div class="text-sm text-gray-500">Opened</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-danger">{{ deliveryStats.failed || 0 }}</div>
                            <div class="text-sm text-gray-500">Failed</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Notification Info -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Details</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm font-medium text-gray-500">Status</label>
                            <div>
                                <span
                                    class="badge"
                                    :class="getStatusBadgeClass(notification.status)"
                                >
                                    {{ getStatusLabel(notification.status) }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-500">Channels</label>
                            <div class="flex flex-wrap gap-1 mt-1">
                                <span
                                    v-for="channel in notification.channels"
                                    :key="channel"
                                    class="badge badge-outline-primary text-xs"
                                >
                                    {{ getChannelLabel(channel) }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-500">Recipients</label>
                            <div class="text-sm">{{ notification.total_recipients }}</div>
                        </div>

                        <div v-if="notification.scheduled_at">
                            <label class="text-sm font-medium text-gray-500">Scheduled</label>
                            <div class="text-sm">{{ formatDate(notification.scheduled_at) }}</div>
                        </div>

                        <div v-if="notification.sent_at">
                            <label class="text-sm font-medium text-gray-500">Sent</label>
                            <div class="text-sm">{{ formatDate(notification.sent_at) }}</div>
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-500">Created</label>
                            <div class="text-sm">{{ formatDate(notification.created_at) }}</div>
                        </div>

                        <div v-if="notification.creator">
                            <label class="text-sm font-medium text-gray-500">Created By</label>
                            <div class="text-sm">{{ notification.creator.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- Recipients Preview -->
                <div class="panel">
                    <h3 class="text-lg font-semibold mb-4">Recent Recipients</h3>
                    <div v-if="recentRecipients.length > 0" class="space-y-2">
                        <div
                            v-for="recipient in recentRecipients"
                            :key="recipient.id"
                            class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                            <icon-user class="w-4 h-4 text-gray-400" />
                            <div class="text-sm">
                                <div>{{ recipient.recipient_email || recipient.recipient_phone || 'Unknown' }}</div>
                                <div class="text-xs text-gray-500">{{ getDeliveryStatusLabel(recipient.status) }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-500">
                        No delivery records yet
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationsStore, type Notification } from '../stores/notifications';
import useNotificationChannels from '../composables/useNotificationChannels';
import IconArrowLeft from '../components/icon/icon-arrow-left.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconSchedule from '../components/icon/icon-schedule.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconUser from '../components/icon/icon-user.vue';

const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();
const { getChannelLabel } = useNotificationChannels();

const notification = ref<Notification | null>(null);
const deliveryStats = ref<any>(null);
const recentRecipients = ref<any[]>([]);

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

const getDeliveryStatusLabel = (status: string) => {
    const labels = {
        pending: 'Pending',
        sent: 'Sent',
        delivered: 'Delivered',
        failed: 'Failed',
        bounced: 'Bounced',
    };
    return labels[status as keyof typeof labels] || status;
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const sendNotification = async () => {
    if (!notification.value) return;
    if (confirm('Are you sure you want to send this notification now?')) {
        try {
            await notificationsStore.sendNotification(notification.value.id);
            await loadNotification();
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
};

const scheduleNotification = async () => {
    if (!notification.value) return;
    const scheduledAt = prompt('Enter scheduled date and time (YYYY-MM-DD HH:MM):');
    if (scheduledAt) {
        try {
            await notificationsStore.scheduleNotification(notification.value.id, scheduledAt);
            await loadNotification();
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    }
};

const deleteNotification = async () => {
    if (!notification.value) return;
    if (confirm('Are you sure you want to delete this notification?')) {
        try {
            await notificationsStore.deleteNotification(notification.value.id);
            router.push('/notifications');
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }
};

const loadNotification = async () => {
    const id = parseInt(route.params.id as string);
    try {
        await notificationsStore.fetchNotification(id);
        notification.value = notificationsStore.currentNotification;

        if (notification.value) {
            // Load delivery statistics
            const stats = await notificationsStore.fetchDeliveryStatistics(notification.value.id);
            if (stats.success) {
                deliveryStats.value = stats.data;
            }

            // Load recent deliveries
            const deliveries = await notificationsStore.fetchDeliveries({
                notification_id: notification.value.id,
                per_page: 5,
            });
            if (deliveries.success) {
                recentRecipients.value = deliveries.deliveries || [];
            }
        }
    } catch (error) {
        console.error('Error loading notification:', error);
    }
};

onMounted(async () => {
    await loadNotification();
});
</script>
