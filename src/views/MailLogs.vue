<template>
    <div>
        <StandardHeader
            :title="t('mail.logs.title')"
            :subtitle="t('mail.logs.subtitle')"
            :navigation-links="navigationLinks"
            :show-add-button="false"
            :show-refresh="true"
            :show-filters="true"
            @refresh="refreshData"
            @clear-filters="clearFilters"
        >
            <template #filters>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.search') }}</label>
                        <div class="relative">
                            <input
                                type="text"
                                :placeholder="t('mail.filters.search_logs')"
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                v-model="filters.search"
                                @input="onSearchInput"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.status') }}</label>
                        <CustomSelect
                            v-model="filters.status"
                            :options="statusOptions"
                            :placeholder="t('mail.filters.all_statuses')"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:modelValue="onFilterChange"
                        />
                    </div>

                    <!-- Date From -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.date_from') }}</label>
                        <input
                            type="date"
                            class="form-input"
                            v-model="filters.date_from"
                            @change="onFilterChange"
                        />
                    </div>

                    <!-- Date To -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.date_to') }}</label>
                        <input
                            type="date"
                            class="form-input"
                            v-model="filters.date_to"
                            @change="onFilterChange"
                        />
                    </div>
                </div>
            </template>
        </StandardHeader>

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
                        <p class="text-white-dark text-sm">{{ t('mail.stats.total') }}</p>
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
                        <p class="text-white-dark text-sm">{{ t('mail.stats.delivered') }}</p>
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
                        <p class="text-white-dark text-sm">{{ t('mail.stats.sent') }}</p>
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
                        <p class="text-white-dark text-sm">{{ t('mail.stats.pending') }}</p>
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
                        <p class="text-white-dark text-sm">{{ t('mail.stats.failed') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mail Logs Table -->
        <div class="panel p-0 border-0 overflow-hidden mt-5">
            <div class="datatable">
                <TableLoader :loading="loading" />
                <vue3-datatable
                    v-if="!loading"
                    :rows="mailLogs"
                    :columns="cols"
                    :isServerMode="true"
                    :totalRows="pagination.total"
                    :loading="loading"
                    :sortable="true"
                    :pagination="true"
                    :page="currentPage"
                    :pageSize="pageSize"
                    :pageSizeOptions="[10, 25, 50, 100]"
                    :search="''"
                    :sortColumn="mailStore.sorting.sort_by"
                    :sortDirection="mailStore.sorting.sort_direction"
                    @change="handleChange"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    :paginationInfo="t('system.table.pagination_info')"
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
import { useI18n } from '../../../moii-localizations/src/composables/useI18n';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { StandardHeader, CustomSelect, TableLoader, IconCheckCircle, IconClock, IconEye, IconMail, IconSearch, IconSend, IconXCircle } from '../../../moii-ui/src/index';

const mailStore = useMailStore();
const contextStore = useContextStore();
const { t } = useI18n();

// Navigation links
const navigationLinks = computed(() => [
    { to: '/mail/templates', label: t('mail.nav.templates') },
    { to: '/mail/logs', label: t('mail.nav.logs') },
]);

// Status options
const statusOptions = computed(() => [
    { label: t('mail.filters.all_statuses'), value: '' },
    { label: t('mail.status.pending'), value: 'pending' },
    { label: t('mail.status.sent'), value: 'sent' },
    { label: t('mail.status.delivered'), value: 'delivered' },
    { label: t('mail.status.failed'), value: 'failed' },
    { label: t('mail.status.bounced'), value: 'bounced' }
]);

interface MailLogsFilterModel {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
}

const filters = ref<MailLogsFilterModel>({});

const currentPage = ref(1);
const pageSize = ref(10);

const loadData = async () => {
    const params: Record<string, any> = {
        page: currentPage.value,
        per_page: pageSize.value,
        sort_by: mailStore.sorting.sort_by,
        sort_direction: mailStore.sorting.sort_direction,
    };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.date_from) params.date_from = filters.value.date_from;
    if (filters.value.date_to) params.date_to = filters.value.date_to;
    await mailStore.fetchMailLogs(params);
};

const clearFilters = () => {
    filters.value = {};
    currentPage.value = 1;
    loadData();
};

const refreshData = async () => {
    currentPage.value = 1;
    await loadData();
    await mailStore.getStats();
};

const mailLogs = computed(() => mailStore.mailLogs);
const loading = computed(() => mailStore.loading);
const pagination = computed(() => mailStore.pagination);
const stats = computed(() => mailStore.stats);

// Table columns
const cols = computed(() => [
    { field: 'to_email', title: t('mail.table.recipient'), width: '200px' },
    { field: 'subject', title: t('mail.table.subject'), width: '250px' },
    { field: 'status', title: t('mail.table.status'), width: '100px' },
    { field: 'priority', title: t('mail.table.priority'), width: '100px' },
    { field: 'created_at', title: t('mail.table.date'), width: '150px' },
    { field: 'actions', title: t('mail.table.actions'), width: '80px', sort: false },
]);

// Handle changes from datatable (pagination, sorting, etc.)
async function handleChange(event: any) {
    if (event.sort_column !== undefined || event.sort_direction !== undefined) {
        mailStore.updateSorting(
            event.sort_column || mailStore.sorting.sort_by,
            ((event.sort_direction || 'asc').toLowerCase()) as 'asc' | 'desc'
        );
        currentPage.value = 1;
        await loadData();
    } else if (event.pagesize !== undefined && event.pagesize !== pageSize.value) {
        pageSize.value = event.pagesize ?? event.per_page ?? event.perPage ?? event.pageSize;
        currentPage.value = 1;
        await loadData();
    } else if (event.current_page !== undefined) {
        currentPage.value = event.current_page ?? event.currentPage ?? event.page;
        await loadData();
    }
}

// Debounced search handler
let searchTimer: ReturnType<typeof setTimeout>;
const onSearchInput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentPage.value = 1;
        loadData();
    }, 300);
};

// Immediate filter change handler
const onFilterChange = () => {
    currentPage.value = 1;
    loadData();
};

// Watch for tenant/app context changes and refetch data
watch([() => contextStore.currentTenantUuid, () => contextStore.currentAppUuid], async () => {
    currentPage.value = 1;
    await loadData();
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
    await loadData();
    await mailStore.getStats();
});
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}


</style>
