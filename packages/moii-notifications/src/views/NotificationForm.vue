<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-4">
                <router-link
                    to="/notifications"
                    class="btn btn-outline-secondary p-2"
                    title="Back to Notifications"
                >
                    <icon-arrow-left class="w-5 h-5" />
                </router-link>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ isEdit ? 'Edit Notification' : 'Create Notification' }}
                </h1>
            </div>
        </div>

        <div class="panel relative z-0 isolate">
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="form.title"
                            type="text"
                            class="form-input mt-1"
                            placeholder="Notification title"
                            required
                        />
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                        </label>
                        <select
                            v-model="form.status"
                            class="form-select mt-1"
                        >
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>

                <!-- Excerpt -->
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Excerpt (Optional)
                    </label>
                    <textarea
                        v-model="form.excerpt"
                        class="form-textarea mt-1"
                        placeholder="Brief summary of the notification"
                        rows="2"
                    ></textarea>
                </div>

                <!-- Content Editor -->
                <NotificationEditor
                    v-model="form.content"
                    placeholder="Enter your notification content..."
                />

                <!-- Channels -->
                <NotificationChannelsSelector
                    v-model="form.channels"
                />

                <!-- Recipients -->
                <NotificationRecipientsSelector
                    v-model="form.recipients"
                />

                <!-- Scheduling -->
                <div v-if="form.status === 'scheduled'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Scheduled Date & Time <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="form.scheduled_at"
                            type="datetime-local"
                            class="form-input mt-1"
                            required
                        />
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <router-link
                        to="/notifications"
                        class="btn btn-outline-secondary"
                    >
                        Cancel
                    </router-link>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="btn btn-primary"
                    >
                        <span v-if="loading">Saving...</span>
                        <span v-else>{{ isEdit ? 'Update' : 'Create' }} Notification</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationsStore, type CreateNotificationData, type UpdateNotificationData } from '../stores/notifications';
import NotificationEditor from '../components/NotificationEditor.vue';
import NotificationChannelsSelector from '../components/NotificationChannelsSelector.vue';
import NotificationRecipientsSelector from '../components/NotificationRecipientsSelector.vue';
import IconArrowLeft from '../components/icon/icon-arrow-left.vue';

const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();

const loading = ref(false);
const isEdit = ref(false);

const form = reactive<CreateNotificationData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    channels: [],
    recipients: [],
});

const handleSubmit = async () => {
    loading.value = true;
    try {
        if (isEdit.value) {
            await notificationsStore.updateNotification(parseInt(route.params.id as string), form as UpdateNotificationData);
        } else {
            await notificationsStore.createNotification(form);
        }
        router.push('/notifications');
    } catch (error) {
        console.error('Error saving notification:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    const id = route.params.id as string;
    if (id) {
        isEdit.value = true;
        try {
            await notificationsStore.fetchNotification(parseInt(id));
            const notification = notificationsStore.currentNotification;
            if (notification) {
                form.title = notification.title;
                form.content = notification.content;
                form.excerpt = notification.excerpt || '';
                form.status = notification.status === 'draft' || notification.status === 'scheduled' ? notification.status : 'draft';
                form.channels = [...notification.channels];
                form.scheduled_at = notification.scheduled_at || '';
                // Note: recipients would need to be fetched separately
            }
        } catch (error) {
            console.error('Error loading notification:', error);
        }
    }
});
</script>
