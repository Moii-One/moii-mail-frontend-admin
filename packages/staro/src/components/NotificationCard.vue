<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="p-6">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <component 
                                :is="channelIcon" 
                                class="h-6 w-6"
                                :class="channelIconColor"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                                {{ notification.title }}
                            </h3>
                            <div class="flex items-center space-x-4 mt-1">
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="statusClasses"
                                >
                                    {{ statusText }}
                                </span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ channelText }}
                                </span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ formatDate(notification.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" v-html="notification.content"></p>
                    </div>

                    <!-- Stats -->
                    <div class="flex items-center space-x-6 mt-4">
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <IconUsers class="h-4 w-4 mr-1" />
                            {{ notification.recipients_count }} recipients
                        </div>
                        <div v-if="notification.sent_count > 0" class="flex items-center text-sm text-green-600">
                            <IconCheck class="h-4 w-4 mr-1" />
                            {{ notification.sent_count }} sent
                        </div>
                        <div v-if="notification.failed_count > 0" class="flex items-center text-sm text-red-600">
                            <IconX class="h-4 w-4 mr-1" />
                            {{ notification.failed_count }} failed
                        </div>
                        <div v-if="notification.opened_count > 0" class="flex items-center text-sm text-blue-600">
                            <IconEye class="h-4 w-4 mr-1" />
                            {{ notification.opened_count }} opened
                        </div>
                    </div>

                    <!-- Scheduled time -->
                    <div v-if="notification.scheduled_at" class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <IconCalendar class="h-4 w-4 mr-1" />
                        Scheduled for {{ formatDate(notification.scheduled_at) }}
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex-shrink-0 ml-4">
                    <div class="flex items-center space-x-2">
                        <button
                            @click="$emit('view', notification)"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="View details"
                        >
                            <IconEye class="h-4 w-4" />
                        </button>
                        
                        <button
                            v-if="canEdit"
                            @click="$emit('edit', notification)"
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Edit notification"
                        >
                            <IconEdit class="h-4 w-4" />
                        </button>

                        <button
                            v-if="canSend"
                            @click="$emit('send', notification)"
                            class="p-2 text-green-400 hover:text-green-600"
                            title="Send now"
                        >
                            <IconSend class="h-4 w-4" />
                        </button>

                        <button
                            v-if="canSchedule"
                            @click="$emit('schedule', notification)"
                            class="p-2 text-blue-400 hover:text-blue-600"
                            title="Schedule notification"
                        >
                            <IconSchedule class="h-4 w-4" />
                        </button>

                        <button
                            v-if="canCancel"
                            @click="$emit('cancel', notification)"
                            class="p-2 text-orange-400 hover:text-orange-600"
                            title="Cancel notification"
                        >
                            <IconX class="h-4 w-4" />
                        </button>

                        <button
                            v-if="canDelete"
                            @click="$emit('delete', notification)"
                            class="p-2 text-red-400 hover:text-red-600"
                            title="Delete notification"
                        >
                            <IconTrash class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Progress bar for sending notifications -->
            <div v-if="notification.status === 'sending'" class="mt-4">
                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Notification } from '../stores/notifications';

// Icons
import IconEmail from './icon/icon-email.vue';
import IconSms from './icon/icon-sms.vue';
import IconPush from './icon/icon-push.vue';
import IconUsers from './icon/icon-users.vue';
import IconCheck from './icon/icon-check.vue';
import IconX from './icon/icon-x.vue';
import IconEye from './icon/icon-eye.vue';
import IconEdit from './icon/icon-edit.vue';
import IconSend from './icon/icon-send.vue';
import IconSchedule from './icon/icon-schedule.vue';
import IconTrash from './icon/icon-trash.vue';
import IconCalendar from './icon/icon-calendar.vue';

interface Props {
    notification: Notification;
}

const props = defineProps<Props>();

defineEmits<{
    view: [notification: Notification];
    edit: [notification: Notification];
    delete: [notification: Notification];
    send: [notification: Notification];
    schedule: [notification: Notification];
    cancel: [notification: Notification];
}>();

// Computed
const channelIcon = computed(() => {
    switch (props.notification.channel) {
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
    switch (props.notification.channel) {
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
    switch (props.notification.channel) {
        case 'email':
            return 'Email';
        case 'sms':
            return 'SMS';
        case 'push':
            return 'Push';
        default:
            return 'Unknown';
    }
});

const statusText = computed(() => {
    switch (props.notification.status) {
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
    switch (props.notification.status) {
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
    return ['draft', 'scheduled'].includes(props.notification.status);
});

const canSend = computed(() => {
    return ['draft'].includes(props.notification.status) && props.notification.recipients_count > 0;
});

const canSchedule = computed(() => {
    return ['draft'].includes(props.notification.status) && props.notification.recipients_count > 0;
});

const canCancel = computed(() => {
    return ['scheduled', 'sending'].includes(props.notification.status);
});

const canDelete = computed(() => {
    return ['draft', 'failed', 'cancelled'].includes(props.notification.status);
});

// Methods
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
