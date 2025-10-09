<template>
    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <icon-monitor class="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ parseUserAgent(session.user_agent) }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        IP: {{ session.ip_address }}
                    </p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <div class="text-right">
                    <p class="text-sm text-gray-900 dark:text-white">
                        Last Activity
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(session.last_activity) }}
                    </p>
                </div>
                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="$emit('terminate', session)"
                    :disabled="loading"
                    title="Terminate Session"
                >
                    <icon-logout class="w-4 h-4" />
                </button>
            </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Created: {{ formatDate(session.created_at) }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { UserSession } from '../stores/sessions';
import IconMonitor from './icon/icon-monitor.vue';
import IconLogout from './icon/icon-logout.vue';

interface Props {
    session: UserSession;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const parseUserAgent = (userAgent: string): string => {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        return 'Chrome Browser';
    } else if (userAgent.includes('Firefox')) {
        return 'Firefox Browser';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        return 'Safari Browser';
    } else if (userAgent.includes('Edg')) {
        return 'Edge Browser';
    } else if (userAgent.includes('Mobile')) {
        return 'Mobile Device';
    } else {
        return 'Unknown Device';
    }
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
};

defineEmits<{
    terminate: [session: UserSession]
}>();
</script>
