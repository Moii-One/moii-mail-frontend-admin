<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">
                    {{ isEdit ? 'Edit Notification List' : 'Create Notification List' }}
                </h3>
                <button
                    @click="$emit('close')"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <icon-x class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        List Name <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="form.name"
                        type="text"
                        class="form-input mt-1"
                        placeholder="Enter list name"
                        required
                    />
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description (Optional)
                    </label>
                    <textarea
                        v-model="form.description"
                        class="form-textarea mt-1"
                        placeholder="Describe this list"
                        rows="3"
                    ></textarea>
                </div>

                <!-- List Type -->
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        List Type <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-2 space-y-3">
                        <label class="flex items-center">
                            <input
                                v-model="form.is_dynamic"
                                type="radio"
                                :value="false"
                                class="form-radio"
                            />
                            <span class="ml-2">Manual List - Add users manually</span>
                        </label>
                        <label class="flex items-center">
                            <input
                                v-model="form.is_dynamic"
                                type="radio"
                                :value="true"
                                class="form-radio"
                            />
                            <span class="ml-2">Dynamic List - Users added based on filters</span>
                        </label>
                    </div>
                </div>

                <!-- Manual List Users -->
                <div v-if="!form.is_dynamic" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add Users
                        </label>
                        <div class="mt-2">
                            <select
                                v-model="selectedUserId"
                                class="form-select"
                                @change="addUser"
                            >
                                <option value="">Select a user to add...</option>
                                <option
                                    v-for="user in availableUsers"
                                    :key="user.uuid"
                                    :value="user.uuid"
                                >
                                    {{ user.name }} ({{ user.email }})
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Selected Users -->
                    <div v-if="form.user_ids && form.user_ids.length > 0">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Selected Users
                        </label>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <span
                                v-for="userId in form.user_ids"
                                :key="userId"
                                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                                {{ getUserName(userId) }}
                                <button
                                    @click="removeUser(userId)"
                                    class="text-primary hover:text-primary-dark"
                                >
                                    <icon-x class="w-3 h-3" />
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Dynamic List Filters -->
                <div v-if="form.is_dynamic" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filters
                        </label>
                        <p class="text-sm text-gray-500 mt-1">
                            Define criteria to automatically include users in this list.
                        </p>
                        <div class="mt-3">
                            <button
                                @click="addFilter"
                                type="button"
                                class="btn btn-outline-primary flex items-center gap-2"
                            >
                                <icon-plus class="w-4 h-4" />
                                Add Filter
                            </button>
                        </div>
                    </div>

                    <!-- Filters List -->
                    <div v-if="form.filters && form.filters.length > 0" class="space-y-3">
                        <div
                            v-for="(filter, index) in form.filters"
                            :key="index"
                            class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded"
                        >
                            <select
                                v-model="filter.field"
                                class="form-select flex-1"
                            >
                                <option value="status">Status</option>
                                <option value="email_verified_at">Email Verified</option>
                                <option value="created_at">Registration Date</option>
                                <option value="last_login_at">Last Login</option>
                            </select>

                            <select
                                v-model="filter.operator"
                                class="form-select"
                            >
                                <option value="=">Equals</option>
                                <option value="!=">Not Equals</option>
                                <option value=">">Greater Than</option>
                                <option value="<">Less Than</option>
                                <option value=">=">Greater or Equal</option>
                                <option value="<=">Less or Equal</option>
                                <option value="like">Contains</option>
                            </select>

                            <input
                                v-model="filter.value"
                                type="text"
                                class="form-input flex-1"
                                placeholder="Value"
                            />

                            <button
                                @click="removeFilter(index)"
                                class="text-danger hover:text-danger-dark"
                            >
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
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
                        <span v-else>{{ isEdit ? 'Update' : 'Create' }} List</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useUsersStore } from '../../../moii-users/src/stores/users';
import { useNotificationsStore, type NotificationList } from '../stores/notifications';
import IconX from '../components/icon/icon-x.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import IconTrash from '../components/icon/icon-trash.vue';

interface Props {
    list?: NotificationList | null;
    isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    list: null,
    isEdit: false,
});

const emit = defineEmits<{
    close: [];
    saved: [];
}>();

const usersStore = useUsersStore();
const notificationsStore = useNotificationsStore();
const loading = ref(false);
const selectedUserId = ref('');

const form = reactive({
    name: '',
    description: '',
    is_dynamic: false,
    filters: [] as any[],
    user_ids: [] as string[],
});

const availableUsers = computed(() => usersStore.users);

const getUserName = (userId: string) => {
    const user = availableUsers.value.find(u => u.uuid === userId);
    return user ? user.name : 'Unknown User';
};

const addUser = () => {
    if (selectedUserId.value && !form.user_ids.includes(selectedUserId.value)) {
        form.user_ids.push(selectedUserId.value);
    }
    selectedUserId.value = '';
};

const removeUser = (userId: string) => {
    form.user_ids = form.user_ids.filter(id => id !== userId);
};

const addFilter = () => {
    form.filters.push({
        field: 'status',
        operator: '=',
        value: 'active',
    });
};

const removeFilter = (index: number) => {
    form.filters.splice(index, 1);
};

const handleSubmit = async () => {
    loading.value = true;
    try {
        if (props.isEdit && props.list) {
            await notificationsStore.updateList(props.list.id, form);
        } else {
            await notificationsStore.createList(form);
        }
        emit('saved');
    } catch (error) {
        console.error('Error saving list:', error);
    } finally {
        loading.value = false;
    }
};

watch(() => props.list, (newList) => {
    if (newList) {
        form.name = newList.name;
        form.description = newList.description || '';
        form.is_dynamic = newList.is_dynamic;
        form.filters = newList.filters ? [...newList.filters] : [];
        // Note: user_ids would need to be fetched separately for existing lists
    } else {
        resetForm();
    }
}, { immediate: true });

const resetForm = () => {
    form.name = '';
    form.description = '';
    form.is_dynamic = false;
    form.filters = [];
    form.user_ids = [];
};

onMounted(async () => {
    // Load users if not already loaded
    if (availableUsers.value.length === 0) {
        await usersStore.fetchUsers();
    }

    if (!props.isEdit) {
        resetForm();
    }
});
</script>
