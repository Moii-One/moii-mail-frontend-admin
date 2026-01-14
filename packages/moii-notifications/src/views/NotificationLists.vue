<template>
    <div>
        <!-- Quick Navigation -->
        <div class="mb-4">
            <button
                type="button"
                class="btn btn-outline-secondary"
                @click="router.push('/notifications')"
            >
                <icon-arrow-left class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                Back to Notifications
            </button>
        </div>

        <!-- Header -->
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">Notification Lists</h5>
                <p class="text-white-dark text-sm mt-1">Manage user lists for targeted notifications</p>
            </div>
            <div class="flex items-center gap-3">
                <button type="button" class="btn btn-primary" @click="openCreateModal">
                    <icon-plus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create List
                </button>
            </div>
        </div>

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
                        <div class="flex gap-2 items-center justify-center">
                            <router-link
                                :to="`/notification-lists/${data.value.uuid}`"
                                class="btn btn-sm btn-outline-info"
                                title="View"
                            >
                                <icon-eye class="w-4 h-4" />
                            </router-link>

                            <router-link
                                :to="`/notification-lists/${data.value.uuid}/edit`"
                                class="btn btn-sm btn-outline-primary"
                                title="Edit"
                            >
                                <icon-edit class="w-4 h-4" />
                            </router-link>

                            <button
                                type="button"
                                @click="deleteList(data.value)"
                                class="btn btn-sm btn-outline-danger"
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
import { useRouter } from 'vue-router';
import { useNotificationsStore, type NotificationList } from '../stores/notifications';
import NotificationListModal from '../components/NotificationListModal.vue';
import IconNotificationList from '../components/icon/icon-notification-list.vue';
import IconList from '../components/icon/icon-list.vue';
import IconFilter from '../components/icon/icon-filter.vue';
import IconUsers from '../components/icon/icon-users.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconArrowLeft from '../components/icon/icon-arrow-left.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import Swal from 'sweetalert2';
import { useToast } from '../composables/useToast';

const router = useRouter();
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
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `You are about to delete "${list.name}". This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });

    if (result.isConfirmed) {
        try {
            await notificationsStore.deleteList(list.uuid);
            showMessage('List deleted successfully.');
        } catch (error) {
            console.error('Error deleting list:', error);
            showMessage('Failed to delete list.', 'error');
        }
    }
};

const { showToast } = useToast();
const showMessage = (msg = '', type: 'success' | 'error' = 'success') => {
    showToast(msg, type);
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

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>