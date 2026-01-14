<template>
    <div>
        <RateLimitsHeader
            title="Rate Limits Management"
            v-model="filters"
            :available-packages="availablePackages"
        />

        <!-- Rate Limits Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-shield class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ rateLimitsStore.totalRateLimits }}</h3>
                        <p class="text-white-dark text-sm">Total Rate Limits</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-square-check class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ rateLimitsStore.activeRateLimits.length }}</h3>
                        <p class="text-white-dark text-sm">Active Limits</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-x class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ rateLimitsStore.blockedRateLimits.length }}</h3>
                        <p class="text-white-dark text-sm">Blocked Limits</p>
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
                        <h3 class="text-xl font-semibold">{{ getTotalBlockedTime() }}</h3>
                        <p class="text-white-dark text-sm">Avg Block Time (min)</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="filteredRateLimits"
                    :columns="cols"
                    :totalRows="filteredRateLimits?.length"
                    :search="filters.search"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #identifier="data">
                        <div class="font-semibold">{{ data.value.identifier }}</div>
                        <div class="text-xs text-white-dark mt-1">{{ data.value.package }}</div>
                    </template>
                    <template #attempts="data">
                        <div class="text-center">
                            <span class="font-semibold">{{ data.value.attempts }}</span>
                            <span class="text-white-dark">/{{ data.value.max_attempts }}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                                class="bg-primary h-2 rounded-full"
                                :style="{ width: getProgressWidth(data.value.attempts, data.value.max_attempts) }"
                            ></div>
                        </div>
                    </template>
                    <template #remaining_attempts="data">
                        <span :class="getRemainingAttemptsClass(data.value.remaining_attempts)">
                            {{ data.value.remaining_attempts }}
                        </span>
                    </template>
                    <template #blocked="data">
                        <span class="badge" :class="data.value.blocked ? 'badge-outline-danger' : 'badge-outline-success'">
                            {{ data.value.blocked ? 'Blocked' : 'Active' }}
                        </span>
                    </template>
                    <template #blocked_until="data">
                        <div v-if="data.value.blocked_until">
                            <div class="text-sm">{{ formatDate(data.value.blocked_until) }}</div>
                            <div class="text-xs text-white-dark">{{ getTimeRemaining(data.value.blocked_until) }}</div>
                        </div>
                        <span v-else class="text-white-dark">-</span>
                    </template>
                    <template #decay_minutes="data">
                        {{ data.value.decay_minutes }} min
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                v-if="hasPermission('rate-limits.view')"
                                type="button"
                                class="btn btn-sm btn-outline-info"
                                @click="checkRateLimit(data.value)"
                                :disabled="rateLimitsStore.loading"
                                title="Check Rate Limit"
                            >
                                <icon-eye class="w-4 h-4" />
                            </button>
                            <button
                                v-if="hasPermission('rate-limits.clear')"
                                type="button"
                                class="btn btn-sm btn-outline-warning"
                                @click="clearRateLimit(data.value)"
                                :disabled="rateLimitsStore.loading"
                                title="Clear Rate Limit"
                            >
                                <icon-refresh class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                    <template #rateType="data">
                        <div class="font-semibold">{{ data.value.label || data.value.rateType }}</div>
                        <div class="text-xs text-white-dark mt-1">{{ data.value.rateType }}</div>
                    </template>
                </vue3-datatable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import { useRateLimitsStore, type RateLimitStatus } from '../stores/rateLimits';
import { useToast } from '../composables/useToast';
import { usePermissions } from '../composables/usePermissions';
import RateLimitsHeader, { type RateLimitFilterModel } from '../components/RateLimitsHeader.vue';
import IconShield from '../components/icon/icon-shield.vue';
import IconSquareCheck from '../components/icon/icon-square-check.vue';
import IconX from '../components/icon/icon-x.vue';
import IconClock from '../components/icon/icon-clock.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const rateLimitsStore = useRateLimitsStore();
const { hasPermission, loadUserPermissions } = usePermissions();

const filters = ref<RateLimitFilterModel>({
    search: '',
    package: '', // Empty by default to show all packages
    status: '',
    blocked: ''
});

const cols = ref([
    { field: 'rateType', title: 'Type' },
    { field: 'identifier', title: 'Identifier' },
    { field: 'attempts', title: 'Attempts' },
    { field: 'remaining_attempts', title: 'Remaining' },
    { field: 'blocked', title: 'Status' },
    { field: 'blocked_until', title: 'Blocked Until' },
    { field: 'decay_minutes', title: 'Decay (min)' },
    { field: 'actions', title: 'Actions', isUnique: true },
]);

// Get unique package keys from rate limit statuses
const availablePackages = computed(() => {
    const keys = new Set(rateLimitsStore.rateLimitStatuses.map(status => status.package));
    return Array.from(keys).sort();
});

// Filter rate limits based on selection
const filteredRateLimits = computed(() => {
    let results = rateLimitsStore.rateLimitStatuses;

    // Apply search filter
    if (filters.value.search) {
        const query = filters.value.search.toLowerCase();
        results = results.filter(limit =>
            limit.identifier.toLowerCase().includes(query) ||
            limit.package.toLowerCase().includes(query) ||
            limit.rateType.toLowerCase().includes(query) ||
            (limit.label && limit.label.toLowerCase().includes(query))
        );
    }

    // Apply package filter
    if (filters.value.package) {
        results = results.filter(limit => limit.package === filters.value.package);
    }

    // Apply status filter
    if (filters.value.status) {
        if (filters.value.status === 'active') {
            results = results.filter(limit => !limit.blocked);
        } else if (filters.value.status === 'blocked') {
            results = results.filter(limit => limit.blocked);
        }
    }

    // Apply blocked filter
    if (filters.value.blocked) {
        const isBlocked = filters.value.blocked === 'true';
        results = results.filter(limit => limit.blocked === isBlocked);
    }

    return results;
});

onMounted(async () => {
    await Promise.all([
        loadRateLimits(),
        loadUserPermissions()
    ]);
});

const loadRateLimits = async () => {
    try {
        // Always load all rate limits from all config keys
        await rateLimitsStore.fetchAllRateLimitStatuses();
    } catch (error) {
        showMessage('Failed to load rate limits.', 'error');
    }
};

const getProgressWidth = (attempts: number, maxAttempts: number): string => {
    const percentage = (attempts / maxAttempts) * 100;
    return `${Math.min(percentage, 100)}%`;
};

const getRemainingAttemptsClass = (remaining: number): string => {
    if (remaining === 0) return 'text-danger font-semibold';
    if (remaining <= 2) return 'text-warning font-semibold';
    return 'text-success font-semibold';
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
};

const getTimeRemaining = (blockedUntil: string): string => {
    const now = new Date();
    const blockedTime = new Date(blockedUntil);
    const diffMs = blockedTime.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expired';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${diffMins}m ${diffSecs}s remaining`;
};

const getTotalBlockedTime = (): string => {
    const blockedLimits = rateLimitsStore.blockedRateLimits;
    if (blockedLimits.length === 0) return '0';

    const totalMinutes = blockedLimits.reduce((sum, limit) => sum + limit.decay_minutes, 0);
    return Math.round(totalMinutes / blockedLimits.length).toString();
};

const checkRateLimit = async (rateLimit: RateLimitStatus) => {
    try {
        const result = await rateLimitsStore.checkRateLimit(rateLimit.package, rateLimit.rateType, rateLimit.identifier);
        Swal.fire({
            title: 'Rate Limit Status',
            html: `<pre class="text-left">${JSON.stringify(result, null, 2)}</pre>`,
            confirmButtonText: 'OK'
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to check rate limit status.', 'error');
    }
};

const clearRateLimit = async (rateLimit: RateLimitStatus) => {
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        });

        if (result.isConfirmed) {
            await rateLimitsStore.clearRateLimit(rateLimit.package, rateLimit.rateType, rateLimit.identifier);
            Swal.fire('Cleared!', 'The rate limit has been cleared.', 'success');
        }
    } catch (error) {
        Swal.fire('Error', 'Failed to clear rate limit.', 'error');
    }
};

const { showToast } = useToast();
const showMessage = (msg = '', type: 'success' | 'error' = 'success') => {
    showToast(msg, type);
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
