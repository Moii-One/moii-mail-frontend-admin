<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    Notification Details
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    View notification information and delivery status
                </p>
            </div>
            <div class="flex space-x-3">
                <router-link
                    to="/notifications"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Back to Notifications
                </router-link>
                <router-link
                    v-if="notification && canEdit"
                    :to="`/notifications/${notification.id}/edit`"
                    class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm"
                >
                    <IconEdit class="w-4 h-4 mr-2" />
                    Edit Notification
                </router-link>
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

        <!-- Notification Details -->
        <div v-else-if="notification" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notification Information</h3>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ notification.title }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Channel
                            </label>
                            <div class="flex items-center">
                                <component 
                                    :is="channelIcon" 
                                    class="h-5 w-5 mr-2"
                                    :class="channelIconColor"
                                />
                                <span class="text-sm text-gray-900 dark:text-white">{{ channelText }}</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <span 
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="statusClasses"
                            >
                                {{ statusText }}
                            </span>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Created
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(notification.created_at) }}</p>
                        </div>

                        <div v-if="notification.scheduled_at">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Scheduled For
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(notification.scheduled_at) }}</p>
                        </div>

                        <div v-if="notification.sent_at">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sent At
                            </label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(notification.sent_at) }}</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                        </label>
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                            <div class="prose max-w-none" v-html="notification.content"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delivery Statistics</h3>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ notification.recipients_count }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Total Recipients</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">{{ notification.sent_count }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Successfully Sent</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">{{ notification.opened_count }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Opened</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">{{ notification.clicked_count }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Clicked</div>
                        </div>
                    </div>

                    <!-- Progress bar for sending notifications -->
                    <div v-if="notification.status === 'sending'" class="mt-6">
                        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Sending progress</span>
                            <span>{{ Math.round((notification.sent_count / notification.recipients_count) * 100) }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                :style="{ width: `${(notification.sent_count / notification.recipients_count) * 100}%` }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div v-if="canPerformActions" class="flex justify-end space-x-3">
                <button
                    v-if="canSend"
                    @click="handleSend"
                    :disabled="actionLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                    <IconSend class="w-4 h-4 mr-2" />
                    Send Now
                </button>

                <button
                    v-if="canCancel"
                    @click="handleCancel"
                    :disabled="actionLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                    <IconX class="w-4 h-4 mr-2" />
                    Cancel
                </button>

                <button
                    v-if="canDelete"
                    @click="handleDelete"
                    :disabled="actionLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                    <IconTrash class="w-4 h-4 mr-2" />
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationsStore } from '../stores/notifications';

// Icons
import IconEdit from '../components/icon/icon-edit.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconX from '../components/icon/icon-x.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconEmail from '../components/icon/icon-email.vue';
import IconSms from '../components/icon/icon-sms.vue';
import IconPush from '../components/icon/icon-push.vue';

const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();

// Reactive data
const loading = ref(false);
const actionLoading = ref(false);
const error = ref<string | null>(null);

// Computed
const notification = computed(() => notificationsStore.currentNotification);

const channelIcon = computed(() => {
    if (!notification.value) return IconEmail;
    switch (notification.value.channel) {
        case 'email':
            return IconEmail;
        case 'sms':
            return IconSms;
        case 'push':
            return IconPush;
        default:
            return IconEmail;
    }
});

const channelIconColor = computed(() => {
    if (!notification.value) return 'text-gray-500';
    switch (notification.value.channel) {
        case 'email':
            return 'text-blue-500';
        case 'sms':
            return 'text-green-500';
        case 'push':
            return 'text-purple-500';
        default:
            return 'text-gray-500';
    }
});

const channelText = computed(() => {
    if (!notification.value) return 'Unknown';
    switch (notification.value.channel) {
        case 'email':
            return 'Email';
        case 'sms':
            return 'SMS';
        case 'push':
            return 'Push Notification';
        default:
            return 'Unknown';
    }
});

const statusText = computed(() => {
    if (!notification.value) return 'Unknown';
    switch (notification.value.status) {
        case 'draft':
            return 'Draft';
        case 'scheduled':
            return 'Scheduled';
        case 'sending':
            return 'Sending';
        case 'sent':
            return 'Sent';
        case 'failed':
            return 'Failed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'Unknown';
    }
});

const statusClasses = computed(() => {
    if (!notification.value) return 'bg-gray-100 text-gray-800';
    switch (notification.value.status) {
        case 'draft':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        case 'scheduled':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'sending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'sent':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'cancelled':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
});

const canEdit = computed(() => {
    return notification.value && ['draft', 'scheduled'].includes(notification.value.status);
});

const canSend = computed(() => {
    return notification.value && ['draft'].includes(notification.value.status) && notification.value.recipients_count > 0;
});

const canCancel = computed(() => {
    return notification.value && ['scheduled', 'sending'].includes(notification.value.status);
});

const canDelete = computed(() => {
    return notification.value && ['draft', 'failed', 'cancelled'].includes(notification.value.status);
});

const canPerformActions = computed(() => {
    return canSend.value || canCancel.value || canDelete.value;
});

// Methods
const loadNotification = async () => {
    const id = parseInt(route.params.id as string);
    if (!id) return;

    loading.value = true;
    error.value = null;

    try {
        await notificationsStore.fetchNotification(id);
        if (!notification.value) {
            error.value = 'Notification not found';
        }
    } catch (err) {
        error.value = 'Failed to load notification';
        console.error('Error loading notification:', err);
    } finally {
        loading.value = false;
    }
};

const handleSend = async () => {
    if (!notification.value) return;

    actionLoading.value = true;
    try {
        await notificationsStore.sendNotification(notification.value.id);
    } catch (err) {
        console.error('Error sending notification:', err);
    } finally {
        actionLoading.value = false;
    }
};

const handleCancel = async () => {
    if (!notification.value) return;

    actionLoading.value = true;
    try {
        await notificationsStore.cancelNotification(notification.value.id);
    } catch (err) {
        console.error('Error canceling notification:', err);
    } finally {
        actionLoading.value = false;
    }
};

const handleDelete = async () => {
    if (!notification.value) return;

    if (confirm('Are you sure you want to delete this notification?')) {
        actionLoading.value = true;
        try {
            await notificationsStore.deleteNotification(notification.value.id);
            router.push('/notifications');
        } catch (err) {
            console.error('Error deleting notification:', err);
        } finally {
            actionLoading.value = false;
        }
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
    loadNotification();
});
</script>
