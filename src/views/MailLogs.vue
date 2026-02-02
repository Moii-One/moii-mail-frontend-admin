<template>
    <div>
        <MailLogsHeader
            title="Mail Logs"
            v-model="filters"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5" v-if="stats">
            <div class="panel bg-gradient-to-r from-blue-500 to-blue-400">
                <div class="flex justify-between">
                    <div class="text-white">
                        <div class="text-3xl font-bold">{{ stats.total }}</div>
                        <div class="text-sm">Total Emails</div>
                    </div>
                    <icon-mail class="w-12 h-12 text-white/50" />
                </div>
            </div>
            <div class="panel bg-gradient-to-r from-green-500 to-green-400">
                <div class="flex justify-between">
                    <div class="text-white">
                        <div class="text-3xl font-bold">{{ stats.delivered }}</div>
                        <div class="text-sm">Delivered</div>
                    </div>
                    <icon-check-circle class="w-12 h-12 text-white/50" />
                </div>
            </div>
            <div class="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                <div class="flex justify-between">
                    <div class="text-white">
                        <div class="text-3xl font-bold">{{ stats.sent }}</div>
                        <div class="text-sm">Sent</div>
                    </div>
                    <icon-send class="w-12 h-12 text-white/50" />
                </div>
            </div>
            <div class="panel bg-gradient-to-r from-yellow-500 to-yellow-400">
                <div class="flex justify-between">
                    <div class="text-white">
                        <div class="text-3xl font-bold">{{ stats.pending }}</div>
                        <div class="text-sm">Pending</div>
                    </div>
                    <icon-clock class="w-12 h-12 text-white/50" />
                </div>
            </div>
            <div class="panel bg-gradient-to-r from-red-500 to-red-400">
                <div class="flex justify-between">
                    <div class="text-white">
                        <div class="text-3xl font-bold">{{ stats.failed }}</div>
                        <div class="text-sm">Failed</div>
                    </div>
                    <icon-x-circle class="w-12 h-12 text-white/50" />
                </div>
            </div>
        </div>

        <!-- Mail Logs Table -->
        <div class="panel p-0 border-0 overflow-hidden mt-5">
            <div class="datatable">
                <vue3-datatable
                    :rows="mailLogs"
                    :columns="cols"
                    :isServerMode="true"
                    :totalRows="pagination.total"
                    :loading="loading"
                    :sortable="true"
                    :pageSize="pagination.per_page"
                    :pageSizeOptions="[10, 25, 50, 100]"
                    @change="handleChange"
                    skin="whitespace-nowrap bh-table-hover"
                >
                    <template #to_email="data">
                        <div>
                            <div class="font-semibold">{{ data.value.to_email }}</div>
                            <div class="text-xs text-gray-500">{{ data.value.to_name }}</div>
                        </div>
                    </template>
                    <template #subject="data">
                        <div class="max-w-md truncate">{{ data.value.subject }}</div>
                    </template>
                    <template #status="data">
                        <span 
                            class="badge"
                            :class="getStatusBadgeClass(data.value.status)"
                        >
                            {{ data.value.status }}
                        </span>
                    </template>
                    <template #priority="data">
                        <span 
                            class="badge badge-outline-secondary"
                        >
                            {{ data.value.priority }}
                        </span>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <router-link 
                                :to="`/mail/logs/${data.value.id}`"
                                class="btn btn-outline-primary btn-sm"
                                title="View Details"
                            >
                                <icon-eye class="w-3 h-3" />
                            </router-link>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMailStore } from '../stores/mail';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import MailLogsHeader from '../components/MailLogsHeader.vue';
import type { MailLogsFilterModel } from '../components/MailLogsHeader.vue';
import IconEye from '../../../../src/components/icon/icon-eye.vue';
import IconMail from '../components/icon/icon-mail.vue';
import IconCheckCircle from '../components/icon/icon-check-circle.vue';
import IconSend from '../components/icon/icon-send.vue';
import IconClock from '../components/icon/icon-clock.vue';
import IconXCircle from '../components/icon/icon-x-circle.vue';

const mailStore = useMailStore();

const filters = ref<MailLogsFilterModel>({});

const mailLogs = computed(() => mailStore.mailLogs);
const loading = computed(() => mailStore.loading);
const pagination = computed(() => mailStore.pagination);
const stats = computed(() => mailStore.stats);

// Table columns
const cols = ref([
    { field: 'to_email', title: 'Recipient', width: '200px' },
    { field: 'subject', title: 'Subject', width: '250px' },
    { field: 'status', title: 'Status', width: '100px' },
    { field: 'priority', title: 'Priority', width: '100px' },
    { field: 'created_at', title: 'Date', width: '150px' },
    { field: 'actions', title: 'Actions', width: '80px', sort: false },
]);

// Build API filters from UI filters
function buildApiFilters(uiFilters: MailLogsFilterModel, page: number = 1, perPage: number = 10): any {
    const apiFilters: any = {
        page,
        per_page: perPage
    };
    
    if (uiFilters.search) {
        apiFilters.search = uiFilters.search;
    }
    
    if (uiFilters.status) {
        apiFilters.status = uiFilters.status;
    }
    
    if (uiFilters.date_from) {
        apiFilters.date_from = uiFilters.date_from;
    }
    
    if (uiFilters.date_to) {
        apiFilters.date_to = uiFilters.date_to;
    }
    
    return apiFilters;
}

// Handle changes from datatable (pagination, sorting, etc.)
async function handleChange(data: any) {
    const apiFilters = buildApiFilters(filters.value, data.current_page, data.pagesize);
    await mailStore.fetchMailLogs(apiFilters);
}

// Watch filters and apply them
watch(filters, async (newFilters) => {
    const apiFilters = buildApiFilters(newFilters, 1, pagination.value.per_page);
    await mailStore.fetchMailLogs(apiFilters);
}, { deep: true });

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const getStatusBadgeClass = (status: string) => {
    const statusClasses: Record<string, string> = {
        'pending': 'badge-outline-warning',
        'sent': 'badge-outline-info',
        'delivered': 'badge-outline-success',
        'failed': 'badge-outline-danger',
        'bounced': 'badge-outline-danger'
    };
    return statusClasses[status] || 'badge-outline-secondary';
};

onMounted(async () => {
    await mailStore.fetchMailLogs({ page: 1, per_page: 10 });
    await mailStore.getStats();
});
</script>
