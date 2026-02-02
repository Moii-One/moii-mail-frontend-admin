<template>
    <div>
        <MailLogsHeader
            title="Mail Logs"
            v-model="filters"
        />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-mail class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats?.total ?? 0 }}</h3>
                        <p class="text-white-dark text-sm">Total Emails</p>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-check-circle class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats?.delivered ?? 0 }}</h3>
                        <p class="text-white-dark text-sm">Delivered</p>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                            <icon-send class="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats?.sent ?? 0 }}</h3>
                        <p class="text-white-dark text-sm">Sent</p>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-clock class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats?.pending ?? 0 }}</h3>
                        <p class="text-white-dark text-sm">Pending</p>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-x-circle class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ stats?.failed ?? 0 }}</h3>
                        <p class="text-white-dark text-sm">Failed</p>
                    </div>
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
                    :pagination="true"
                    :page="pagination.current_page"
                    :pageSize="pagination.per_page"
                    :pageSizeOptions="[10, 25, 50, 100]"
                    @change="handleChange"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
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
import { useContextStore } from '../../../../packages/moii-users/src/stores/context';
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
const contextStore = useContextStore();

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

// Watch for tenant/app context changes and refetch data
watch([() => contextStore.currentTenantUuid, () => contextStore.currentAppUuid], async () => {
    await mailStore.fetchMailLogs({ page: 1, per_page: 10 });
    await mailStore.getStats();
});

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

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Fix multiselect dropdown z-index */
.custom-multiselect-wrapper {
    position: relative;
    z-index: 50;
}

.custom-multiselect .multiselect__content-wrapper {
    z-index: 100 !important;
}
</style>
