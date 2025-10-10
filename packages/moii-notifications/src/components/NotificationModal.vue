<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                @click="$emit('close')"
                            >
                                <icon-x class="w-6 h-6" />
                            </button>
                            <div class="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {{ isEdit ? 'Edit Notification' : 'Create Notification' }}
                            </div>
                            <div class="p-5">
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
                    />                                    <!-- Actions -->
                                    <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            @click="$emit('close')"
                                            class="btn btn-outline-secondary"
                                        >
                                            Cancel
                                        </button>
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
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useNotificationsStore, type Notification, type CreateNotificationData, type UpdateNotificationData } from '../stores/notifications';
import NotificationEditor from '../components/NotificationEditor.vue';
import NotificationChannelsSelector from '../components/NotificationChannelsSelector.vue';
import NotificationRecipientsSelector from '../components/NotificationRecipientsSelector.vue';
import IconX from '../components/icon/icon-x.vue';
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogPanel } from '@headlessui/vue';

interface Props {
    notification?: Notification | null;
    isEdit?: boolean;
    show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    notification: null,
    isEdit: false,
    show: false,
});

const emit = defineEmits<{
    close: [];
    saved: [];
}>();

const notificationsStore = useNotificationsStore();
const loading = ref(false);

const form = reactive<CreateNotificationData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    channels: [],
    recipients: [],
    scheduled_at: undefined,
});

const handleSubmit = async () => {
    // Validate recipients
    if (!form.recipients || form.recipients.length === 0) {
        alert('Please add at least one recipient before submitting.');
        return;
    }
    
    loading.value = true;
    try {
        if (props.isEdit && props.notification) {
            await notificationsStore.updateNotification(props.notification.id, form as UpdateNotificationData);
        } else {
            await notificationsStore.createNotification(form);
        }
        emit('saved');
    } catch (error) {
        loading.value = false;
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    form.title = '';
    form.content = '';
    form.excerpt = '';
    form.status = 'draft';
    form.channels = [];
    form.recipients = [];
    form.scheduled_at = undefined;
};

watch(() => props.notification, (newNotification) => {
    if (newNotification) {
        form.title = newNotification.title;
        form.content = newNotification.content;
        form.excerpt = newNotification.excerpt || '';
        form.status = newNotification.status === 'draft' || newNotification.status === 'scheduled' ? newNotification.status : 'draft';
        form.channels = [...newNotification.channels];
        form.scheduled_at = newNotification.scheduled_at || '';
        // Note: recipients would need to be fetched separately
    } else {
        resetForm();
    }
}, { immediate: true });

onMounted(() => {
    if (!props.isEdit) {
        resetForm();
    }
});
</script>
