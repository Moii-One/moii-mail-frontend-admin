<template>
    <div>
        <NotificationsHeader
            title="Notification Lists"
            :total-items="lists.length"
            :show-stats="true"
            :show-filters="false"
            :show-create="true"
            create-label="List"
            @create="openCreateModal"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-notification-list class="w-8 h-8 text-primary" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ lists.length }}</h3>
                        <p class="text-white-dark text-sm">Total Lists</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-list class="w-8 h-8 text-success" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ manualLists.length }}</h3>
                        <p class="text-white-dark text-sm">Manual Lists</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-filter class="w-8 h-8 text-info" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ dynamicLists.length }}</h3>
                        <p class="text-white-dark text-sm">Dynamic Lists</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <icon-users class="w-8 h-8 text-warning" />
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ totalUsers }}</h3>
                        <p class="text-white-dark text-sm">Total Users</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lists Table -->
        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="lists"
                    :columns="cols"
                    :loading="loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                >
                    <template #name="data">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <component
                                    :is="data.value.is_dynamic ? IconFilter : IconList"
                                    class="w-5 h-5 text-primary mr-3"
                                />
                            </div>
                            <div>
                                <div class="font-semibold">{{ data.value.name }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ data.value.is_dynamic ? 'Dynamic' : 'Manual' }}
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #users_count="data">
                        <div class="text-center">
                            <span class="badge badge-outline-primary">
                                {{ data.value.users_count }}
                            </span>
                        </div>
                    </template>

                    <template #created_at="data">
                        <div class="text-sm">
                            {{ formatDate(data.value.created_at) }}
                        </div>
                    </template>

                    <template #actions="data">
                        <div class="flex items-center gap-2">
                            <router-link
                                :to="`/notification-lists/${data.value.id}`"
                                class="text-info hover:text-info-dark"
                                title="View"
                            >
                                <icon-eye class="w-4 h-4" />
                            </router-link>

                            <router-link
                                :to="`/notification-lists/${data.value.id}/edit`"
                                class="text-warning hover:text-warning-dark"
                                title="Edit"
                            >
                                <icon-edit class="w-4 h-4" />
                            </router-link>

                            <button
                                @click="deleteList(data.value)"
                                class="text-danger hover:text-danger-dark"
                                title="Delete"
                            >
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <NotificationListModal
            v-if="showModal"
            :list="selectedList"
            :is-edit="isEdit"
            @close="closeModal"
            @saved="handleSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotificationsStore, type NotificationList } from '../stores/notifications';
import NotificationsHeader from '../components/NotificationsHeader.vue';
import NotificationListModal from '../components/NotificationListModal.vue';
import IconNotificationList from '../components/icon/icon-notification-list.vue';
import IconList from '../components/icon/icon-list.vue';
import IconFilter from '../components/icon/icon-filter.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';

const notificationsStore = useNotificationsStore();

const showModal = ref(false);
const isEdit = ref(false);
const selectedList = ref<NotificationList | null>(null);
const loading = ref(false);

const lists = computed(() => notificationsStore.lists);
const dynamicLists = computed(() => notificationsStore.dynamicLists);
const manualLists = computed(() => notificationsStore.manualLists);
const totalUsers = computed(() => lists.value.reduce((sum, list) => sum + list.users_count, 0));

const cols = [
    { field: 'name', title: 'List Name', sort: true },
    { field: 'description', title: 'Description' },
    { field: 'users_count', title: 'Users', width: '120px' },
    { field: 'created_at', title: 'Created', sort: true },
    { field: 'actions', title: 'Actions', width: '150px' },
];

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

const openCreateModal = () => {
    selectedList.value = null;
    isEdit.value = false;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedList.value = null;
};

const handleSaved = async () => {
    closeModal();
    await loadLists();
};

const deleteList = async (list: NotificationList) => {
    if (confirm('Are you sure you want to delete this list?')) {
        try {
            await notificationsStore.deleteList(list.id);
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    }
};

const loadLists = async () => {
    loading.value = true;
    try {
        await notificationsStore.fetchLists();
    } catch (error) {
        console.error('Error loading lists:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadLists();
});
</script>
