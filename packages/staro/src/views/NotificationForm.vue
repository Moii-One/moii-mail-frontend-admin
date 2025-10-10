<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ isEdit ? 'Edit Notification' : 'Create Notification' }}
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ isEdit ? 'Update notification details' : 'Create a new notification to send to your users' }}
                </p>
            </div>
            <router-link
                to="/notifications"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                Back to Notifications
            </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notification Details</h3>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            v-model="form.title"
                            type="text"
                            required
                            placeholder="Enter notification title"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                    </div>

                    <!-- Channel -->
                    <div>
                        <label for="channel" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Channel <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="channel"
                            v-model="form.channel"
                            required
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="">Select channel</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="push">Push Notification</option>
                        </select>
                    </div>

                    <!-- Content -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content <span class="text-red-500">*</span>
                        </label>
                        <div class="border border-gray-300 dark:border-gray-600 rounded-md">
                            <quillEditor
                                v-model:content="form.content"
                                content-type="html"
                                :options="editorOptions"
                                class="min-h-[200px]"
                                @ready="onEditorReady"
                            />
                        </div>
                    </div>

                    <!-- Scheduled Date -->
                    <div>
                        <label for="scheduled_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Schedule for Later (Optional)
                        </label>
                        <input
                            id="scheduled_at"
                            v-model="form.scheduled_at"
                            type="datetime-local"
                            :min="minDateTime"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Leave empty to save as draft. You can send immediately or schedule for later.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recipients -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recipients</h3>
                </div>
                
                <div class="p-6">
                    <RecipientSelector 
                        v-model:userIds="form.user_ids"
                        v-model:listIds="form.list_ids"
                    />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
                <router-link
                    to="/notifications"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Cancel
                </router-link>
                
                <button
                    type="button"
                    @click="handleSaveDraft"
                    :disabled="loading || !form.title || !form.content"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                    <span v-if="loading" class="mr-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    </span>
                    Save as Draft
                </button>

                <button
                    v-if="form.scheduled_at"
                    type="submit"
                    :disabled="loading || !isFormValid"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    <span v-if="loading" class="mr-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </span>
                    <IconSchedule class="w-4 h-4 mr-2" />
                    Schedule Notification
                </button>

                <button
                    v-else
                    type="submit"
                    :disabled="loading || !isFormValid"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    <span v-if="loading" class="mr-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </span>
                    <IconSend class="w-4 h-4 mr-2" />
                    Send Now
                </button>
            </div>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
                <IconX class="h-5 w-5 text-red-400 mr-2" />
                <div class="text-sm text-red-800 dark:text-red-200">{{ error }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { quillEditor } from 'vue3-quill';
import 'vue3-quill/lib/vue3-quill.css';
import { useNotificationsStore } from '../stores/notifications';
import type { CreateNotificationData, UpdateNotificationData } from '../stores/notifications';

// Components
import RecipientSelector from '../components/RecipientSelector.vue';

// Icons
import IconSchedule from '../components/icon/icon-schedule.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconX from '../components/icon/icon-x.vue';

const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();

// Reactive data
const loading = ref(false);
const error = ref<string | null>(null);
const editor = ref<any>(null);

const form = ref<CreateNotificationData & { id?: number }>({
    title: '',
    content: '',
    channel: 'email',
    scheduled_at: '',
    user_ids: [],
    list_ids: [],
});

// Computed
const isEdit = computed(() => !!route.params.id);
const minDateTime = computed(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
});

const isFormValid = computed(() => {
    return form.value.title && 
           form.value.content && 
           form.value.channel && 
           (form.value.user_ids?.length || form.value.list_ids?.length);
});

// Quill editor options
const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
        ]
    },
    placeholder: 'Enter notification content...',
};

// Methods
const onEditorReady = (quill: any) => {
    editor.value = quill;
};

const loadNotification = async () => {
    if (!isEdit.value) return;
    
    const id = parseInt(route.params.id as string);
    loading.value = true;
    error.value = null;

    try {
        const notification = await notificationsStore.fetchNotification(id);
        if (notification) {
            form.value = {
                id: notification.id,
                title: notification.title,
                content: notification.content,
                channel: notification.channel,
                scheduled_at: notification.scheduled_at ? 
                    new Date(notification.scheduled_at).toISOString().slice(0, 16) : '',
                user_ids: [], // Would need to fetch recipients
                list_ids: [], // Would need to fetch recipients
            };
        }
    } catch (err) {
        error.value = 'Failed to load notification';
        console.error('Error loading notification:', err);
    } finally {
        loading.value = false;
    }
};

const handleSaveDraft = async () => {
    if (!form.value.title || !form.value.content) return;

    loading.value = true;
    error.value = null;

    try {
        if (isEdit.value && form.value.id) {
            const data: UpdateNotificationData = {
                title: form.value.title,
                content: form.value.content,
                channel: form.value.channel,
                user_ids: form.value.user_ids,
                list_ids: form.value.list_ids,
            };
            await notificationsStore.updateNotification(form.value.id, data);
        } else {
            const data: CreateNotificationData = {
                title: form.value.title,
                content: form.value.content,
                channel: form.value.channel,
                user_ids: form.value.user_ids,
                list_ids: form.value.list_ids,
            };
            await notificationsStore.createNotification(data);
        }

        router.push('/notifications');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to save notification';
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async () => {
    if (!isFormValid.value) return;

    loading.value = true;
    error.value = null;

    try {
        let notification;
        if (isEdit.value && form.value.id) {
            const data: UpdateNotificationData = {
                title: form.value.title,
                content: form.value.content,
                channel: form.value.channel,
                scheduled_at: form.value.scheduled_at || undefined,
                user_ids: form.value.user_ids,
                list_ids: form.value.list_ids,
            };
            notification = await notificationsStore.updateNotification(form.value.id, data);
        } else {
            const data: CreateNotificationData = {
                title: form.value.title,
                content: form.value.content,
                channel: form.value.channel,
                scheduled_at: form.value.scheduled_at || undefined,
                user_ids: form.value.user_ids,
                list_ids: form.value.list_ids,
            };
            notification = await notificationsStore.createNotification(data);
        }

        // If no scheduled date, send immediately
        if (!form.value.scheduled_at && notification) {
            if (form.value.scheduled_at) {
                await notificationsStore.scheduleNotification(notification.id, form.value.scheduled_at);
            } else {
                await notificationsStore.sendNotification(notification.id);
            }
        }

        router.push('/notifications');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to process notification';
    } finally {
        loading.value = false;
    }
};

// Lifecycle
onMounted(() => {
    loadNotification();
});
</script>
