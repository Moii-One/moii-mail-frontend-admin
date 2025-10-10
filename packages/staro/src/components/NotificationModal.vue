<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div 
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                @click="$emit('close')"
            ></div>

            <!-- Modal panel -->
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div class="sm:flex sm:items-start">
                    <!-- Icon -->
                    <div 
                        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                        :class="iconClasses"
                    >
                        <component :is="icon" class="h-6 w-6" />
                    </div>
                    
                    <!-- Content -->
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            {{ title }}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ message }}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        @click="$emit('confirm')"
                        type="button"
                        :class="confirmButtonClasses"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        {{ confirmText }}
                    </button>
                    <button
                        @click="$emit('close')"
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Notification } from '../stores/notifications';

// Icons
import IconTrash from './icon/icon-trash.vue';
import IconSend from './icon/icon-send.vue';
import IconX from './icon/icon-x.vue';

interface Props {
    notification: Notification | null;
    mode: 'delete' | 'send' | 'cancel';
}

const props = defineProps<Props>();

defineEmits<{
    close: [];
    confirm: [];
}>();

// Computed
const show = computed(() => props.notification !== null);

const icon = computed(() => {
    switch (props.mode) {
        case 'delete':
            return IconTrash;
        case 'send':
            return IconSend;
        case 'cancel':
            return IconX;
        default:
            return IconTrash;
    }
});

const iconClasses = computed(() => {
    switch (props.mode) {
        case 'delete':
            return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
        case 'send':
            return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
        case 'cancel':
            return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
        default:
            return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    }
});

const title = computed(() => {
    switch (props.mode) {
        case 'delete':
            return 'Delete Notification';
        case 'send':
            return 'Send Notification';
        case 'cancel':
            return 'Cancel Notification';
        default:
            return 'Confirm Action';
    }
});

const message = computed(() => {
    if (!props.notification) return '';
    
    switch (props.mode) {
        case 'delete':
            return `Are you sure you want to delete "${props.notification.title}"? This action cannot be undone.`;
        case 'send':
            return `Are you sure you want to send "${props.notification.title}" to ${props.notification.recipients_count} recipients? This action cannot be undone.`;
        case 'cancel':
            return `Are you sure you want to cancel "${props.notification.title}"? This will stop the notification from being sent.`;
        default:
            return 'Are you sure you want to perform this action?';
    }
});

const confirmText = computed(() => {
    switch (props.mode) {
        case 'delete':
            return 'Delete';
        case 'send':
            return 'Send Now';
        case 'cancel':
            return 'Cancel Notification';
        default:
            return 'Confirm';
    }
});

const confirmButtonClasses = computed(() => {
    switch (props.mode) {
        case 'delete':
            return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
        case 'send':
            return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white';
        case 'cancel':
            return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white';
        default:
            return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
    }
});
</script>
