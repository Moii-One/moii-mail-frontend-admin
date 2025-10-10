<template>
    <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipients <span class="text-red-500">*</span>
        </label>

        <!-- Selected Recipients Summary -->
        <div v-if="recipients.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
                v-for="(recipient, index) in recipients"
                :key="index"
                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
                <component :is="getRecipientIcon(recipient.type)" class="w-4 h-4" />
                {{ getRecipientLabel(recipient) }}
                <button
                    @click="removeRecipient(index)"
                    type="button"
                    class="ml-1 text-primary hover:text-primary-dark"
                >
                    <icon-x class="w-3 h-3" />
                </button>
            </span>
        </div>

        <!-- Add Recipients -->
        <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center gap-4 mb-4">
                <select
                    v-model="newRecipientType"
                    class="form-select flex-1"
                >
                    <option value="user">Individual User</option>
                    <option value="list">User List</option>
                    <option value="external">External Recipient</option>
                </select>

                <button
                    @click="addRecipient"
                    type="button"
                    class="btn btn-primary flex items-center gap-2"
                >
                    <icon-plus class="w-4 h-4" />
                    Add Recipient
                </button>
            </div>

            <!-- User Selection -->
            <div v-if="newRecipientType === 'user'" class="space-y-4">
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Select User</label>
                    <select
                        v-model="selectedUserId"
                        class="form-select mt-1"
                    >
                        <option value="">Choose a user...</option>
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

            <!-- List Selection -->
            <div v-if="newRecipientType === 'list'" class="space-y-4">
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Select List</label>
                    <select
                        v-model="selectedListId"
                        class="form-select mt-1"
                    >
                        <option value="">Choose a list...</option>
                        <option
                            v-for="list in availableLists"
                            :key="list.id"
                            :value="list.id"
                        >
                            {{ list.name }} ({{ list.users_count }} users)
                        </option>
                    </select>
                </div>
            </div>

            <!-- External Recipient -->
            <div v-if="newRecipientType === 'external'" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            v-model="externalEmail"
                            type="email"
                            class="form-input mt-1"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number (Optional)</label>
                        <input
                            v-model="externalPhone"
                            type="tel"
                            class="form-input mt-1"
                            placeholder="+1234567890"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="recipients.length === 0" class="text-sm text-red-600 dark:text-red-400">
            Please add at least one recipient.
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUsersStore } from '../../../moii-users/src/stores/users';
import { useNotificationsStore } from '../stores/notifications';
import IconPlus from './icon/icon-plus.vue';
import IconX from './icon/icon-x.vue';
import IconUser from './icon/icon-user.vue';
import IconList from './icon/icon-list.vue';
import IconMail from './icon/icon-mail.vue';

interface Recipient {
    type: 'user' | 'list' | 'external';
    user_id?: string;
    list_id?: number;
    email?: string;
    phone?: string;
    push_tokens?: string[];
}

interface Props {
    modelValue: Recipient[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: Recipient[]];
}>();

const usersStore = useUsersStore();
const notificationsStore = useNotificationsStore();

const newRecipientType = ref<'user' | 'list' | 'external'>('user');
const selectedUserId = ref('');
const selectedListId = ref('');
const externalEmail = ref('');
const externalPhone = ref('');

const recipients = ref<Recipient[]>([...props.modelValue]);
const availableUsers = computed(() => usersStore.users);
const availableLists = computed(() => notificationsStore.lists);

const getRecipientIcon = (type: string) => {
    const icons = {
        user: IconUser,
        list: IconList,
        external: IconMail,
    };
    return icons[type as keyof typeof icons] || IconUser;
};

const getRecipientLabel = (recipient: Recipient) => {
    switch (recipient.type) {
        case 'user':
            const user = availableUsers.value.find(u => u.uuid === recipient.user_id);
            return user ? user.name : 'Unknown User';
        case 'list':
            const list = availableLists.value.find(l => l.id === recipient.list_id);
            return list ? list.name : 'Unknown List';
        case 'external':
            return recipient.email || 'External Recipient';
        default:
            return 'Unknown';
    }
};

const addRecipient = () => {
    let newRecipient: Recipient | null = null;

    switch (newRecipientType.value) {
        case 'user':
            if (selectedUserId.value) {
                newRecipient = {
                    type: 'user',
                    user_id: selectedUserId.value,
                };
            }
            break;
        case 'list':
            if (selectedListId.value) {
                newRecipient = {
                    type: 'list',
                    list_id: parseInt(selectedListId.value),
                };
            }
            break;
        case 'external':
            if (externalEmail.value) {
                newRecipient = {
                    type: 'external',
                    email: externalEmail.value,
                    phone: externalPhone.value || undefined,
                };
            }
            break;
    }

    if (newRecipient) {
        recipients.value.push(newRecipient);
        emit('update:modelValue', [...recipients.value]);
        resetForm();
    }
};

const removeRecipient = (index: number) => {
    recipients.value.splice(index, 1);
    emit('update:modelValue', [...recipients.value]);
};

const resetForm = () => {
    selectedUserId.value = '';
    selectedListId.value = '';
    externalEmail.value = '';
    externalPhone.value = '';
};

onMounted(async () => {
    // Load users and lists if not already loaded
    if (availableUsers.value.length === 0) {
        await usersStore.fetchUsers();
    }
    if (availableLists.value.length === 0) {
        await notificationsStore.fetchLists();
    }
});

watch(() => props.modelValue, (newValue) => {
    recipients.value = [...newValue];
}, { immediate: true });
</script>
