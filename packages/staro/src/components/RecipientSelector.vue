<template>
    <div class="space-y-4">
        <!-- Selection Type -->
        <div>
            <fieldset>
                <legend class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Recipients
                </legend>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <input
                            id="select-users"
                            v-model="selectionType"
                            value="users"
                            type="radio"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label for="select-users" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Select Individual Users
                        </label>
                    </div>
                    <div class="flex items-center">
                        <input
                            id="select-lists"
                            v-model="selectionType"
                            value="lists"
                            type="radio"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label for="select-lists" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Select User Lists
                        </label>
                    </div>
                    <div class="flex items-center">
                        <input
                            id="select-both"
                            v-model="selectionType"
                            value="both"
                            type="radio"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <label for="select-both" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Select Both Users and Lists
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>

        <!-- User Selection -->
        <div v-if="selectionType === 'users' || selectionType === 'both'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Individual Users
            </label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Search and select individual users:
                </p>
                <input
                    v-model="userSearch"
                    type="text"
                    placeholder="Search users by name or email..."
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:text-white sm:text-sm mb-3"
                />
                
                <!-- Selected Users -->
                <div v-if="selectedUserIds.length" class="mb-3">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Users ({{ selectedUserIds.length }}):
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="userId in selectedUserIds"
                            :key="userId"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        >
                            User {{ userId }}
                            <button
                                @click="removeUser(userId)"
                                type="button"
                                class="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-600"
                            >
                                <IconX class="h-3 w-3" />
                            </button>
                        </span>
                    </div>
                </div>

                <!-- Quick Add User ID -->
                <div class="flex gap-2">
                    <input
                        v-model="newUserId"
                        type="number"
                        placeholder="Enter user ID"
                        class="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:text-white sm:text-sm"
                    />
                    <button
                        @click="addUser"
                        type="button"
                        :disabled="!newUserId || selectedUserIds.includes(newUserId)"
                        class="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>

        <!-- List Selection -->
        <div v-if="selectionType === 'lists' || selectionType === 'both'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Lists
            </label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Select from existing notification lists:
                </p>
                
                <!-- Loading Lists -->
                <div v-if="loadingLists" class="text-center py-4">
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
                
                <!-- Lists -->
                <div v-else-if="availableLists.length" class="space-y-2 max-h-48 overflow-y-auto">
                    <div
                        v-for="list in availableLists"
                        :key="list.id"
                        class="flex items-center"
                    >
                        <input
                            :id="`list-${list.id}`"
                            v-model="selectedListIds"
                            :value="list.id"
                            type="checkbox"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                            :for="`list-${list.id}`"
                            class="ml-3 flex-1 text-sm text-gray-700 dark:text-gray-300"
                        >
                            {{ list.name }}
                            <span class="text-gray-500 dark:text-gray-400">
                                ({{ list.user_count }} users)
                            </span>
                            <div v-if="list.description" class="text-xs text-gray-500 dark:text-gray-400">
                                {{ list.description }}
                            </div>
                        </label>
                    </div>
                </div>
                
                <!-- No Lists -->
                <div v-else class="text-center py-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        No notification lists found.
                        <router-link to="/notifications/lists/create" class="text-primary-600 hover:text-primary-500">
                            Create a list
                        </router-link>
                    </p>
                </div>
            </div>
        </div>

        <!-- Recipients Summary -->
        <div v-if="totalRecipients > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div class="flex items-center">
                <IconUsers class="h-5 w-5 text-blue-400 mr-2" />
                <div class="text-sm">
                    <p class="text-blue-800 dark:text-blue-200 font-medium">
                        Total Recipients: {{ totalRecipients }}
                    </p>
                    <p class="text-blue-600 dark:text-blue-300">
                        {{ selectedUserIds.length }} individual users, 
                        {{ selectedListIds.length }} lists selected
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationListsStore } from '../stores/notificationLists';

// Icons
import IconUsers from './icon/icon-users.vue';
import IconX from './icon/icon-x.vue';

interface Props {
    userIds?: number[];
    listIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
    userIds: () => [],
    listIds: () => [],
});

const emit = defineEmits<{
    'update:userIds': [userIds: number[]];
    'update:listIds': [listIds: number[]];
}>();

const notificationListsStore = useNotificationListsStore();

// Reactive data
const selectionType = ref<'users' | 'lists' | 'both'>('users');
const userSearch = ref('');
const newUserId = ref<number | null>(null);
const selectedUserIds = ref<number[]>([...props.userIds]);
const selectedListIds = ref<number[]>([...props.listIds]);
const loadingLists = ref(false);

// Computed
const { lists: availableLists } = storeToRefs(notificationListsStore);

const totalRecipients = computed(() => {
    const userCount = selectedUserIds.value.length;
    const listCount = selectedListIds.value.reduce((total, listId) => {
        const list = availableLists.value.find(l => l.id === listId);
        return total + (list?.user_count || 0);
    }, 0);
    return userCount + listCount;
});

// Methods
const addUser = () => {
    if (newUserId.value && !selectedUserIds.value.includes(newUserId.value)) {
        selectedUserIds.value.push(newUserId.value);
        newUserId.value = null;
    }
};

const removeUser = (userId: number) => {
    const index = selectedUserIds.value.indexOf(userId);
    if (index > -1) {
        selectedUserIds.value.splice(index, 1);
    }
};

const loadLists = async () => {
    loadingLists.value = true;
    try {
        await notificationListsStore.fetchLists();
    } catch (error) {
        console.error('Failed to load notification lists:', error);
    } finally {
        loadingLists.value = false;
    }
};

// Watchers
watch(selectedUserIds, (newUserIds) => {
    emit('update:userIds', newUserIds);
}, { deep: true });

watch(selectedListIds, (newListIds) => {
    emit('update:listIds', newListIds);
}, { deep: true });

// Lifecycle
onMounted(() => {
    loadLists();
});
</script>
