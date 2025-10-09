<template>
    <div class="mb-6">
        <!-- Header Panel -->
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">User Sessions</h5>
                <p class="text-white-dark text-sm mt-1">Monitor and manage user login sessions</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    class="btn btn-danger"
                    @click="terminateAllSessions"
                    :disabled="sessionsStore.loading"
                >
                    <icon-trash class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Terminate All Sessions
                </button>
            </div>
        </div>

        <!-- Sessions Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-monitor class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ sessionsRows.length }}</h3>
                        <p class="text-white-dark text-sm">Active Sessions</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-globe class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ uniqueIPs }}</h3>
                        <p class="text-white-dark text-sm">Unique IPs</p>
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
                        <h3 class="text-xl font-semibold">{{ recentSessions }}</h3>
                        <p class="text-white-dark text-sm">Recent Activity</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="sessionsRows.length > 0 || sessionsStore.loading">
                <vue3-datatable
                    :rows="sessionsRows"
                    :columns="cols"
                    :totalRows="sessionsRows.length"
                    :search="''"
                    :loading="sessionsStore.loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #device_info="data">
                        <div class="max-w-xs" :title="data.value.device_info">
                            {{ data.value.device_info }}
                        </div>
                    </template>
                    <template #ip_address="data">
                        <span class="font-mono text-sm">{{ data.value.ip_address }}</span>
                    </template>
                    <template #location="data">
                        <span>{{ data.value.location }}</span>
                    </template>
                    <template #last_activity_human="data">
                        <div class="text-sm">{{ data.value.last_activity_human }}</div>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #is_current="data">
                        <span v-if="data.value.is_current" class="badge badge-outline-success">Current</span>
                        <span v-else class="text-white-dark">-</span>
                    </template>
                    <template #actions="data">
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="terminateSession(data.value)"
                                :disabled="sessionsStore.loading"
                                title="Terminate this session"
                            >
                                <icon-trash class="w-3 h-3" /> 
                            </button>                        
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No sessions found
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useSessionsStore, type UserSession } from '../stores/sessions';
import IconMonitor from '../components/icon/icon-monitor.vue';
import IconGlobe from '../components/icon/icon-globe.vue';
import IconClock from '../components/icon/icon-clock.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const route = useRoute();
const sessionsStore = useSessionsStore();

const sessionsRows = computed(() => {
    console.log('Computing sessionsRows:', sessionsStore.sessions);
    return sessionsStore.sessions;
});

const uniqueIPs = computed(() => {
    const ips = sessionsStore.sessions.map(session => session.ip_address);
    return new Set(ips).size;
});

const recentSessions = computed(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return sessionsStore.sessions.filter(session =>
        new Date(session.last_activity) > oneHourAgo
    ).length;
});

onMounted(async () => {
    await loadSessions();
});

watch(() => sessionsStore.sessions, (newSessions) => {
    console.log('Sessions updated:', newSessions);
}, { deep: true });

const loadSessions = async () => {
    try {
        const userUuid = route.params.userUuid as string;
        console.log('Loading sessions for userUuid:', userUuid);
        if (userUuid) {
            const data = await sessionsStore.getUserSessions(userUuid);
            console.log('Sessions data returned from API:', data);
            console.log('Sessions store sessions after API call:', sessionsStore.sessions);
            console.log('Sessions rows computed:', sessionsRows.value);
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
        showMessage('Failed to load sessions.', 'error');
    }
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const getTimeAgo = (dateString: string): string => {
    try {
        const now = new Date();
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const terminateSession = async (session: UserSession) => {
    const result = await Swal.fire({
        title: 'Terminate Session?',
        text: `Are you sure you want to terminate this session from ${session.ip_address}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, terminate',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            const userUuid = route.params.userUuid as string;
            await sessionsStore.terminateSession(session.uuid, userUuid);
            showMessage('Session terminated successfully.');
        } catch (error: any) {
            console.error('Terminate session error:', error);
            showMessage(error?.message || 'Failed to terminate session.', 'error');
        }
    }
};

const terminateAllSessions = async () => {
    const result = await Swal.fire({
        title: 'Terminate All Sessions?',
        text: `Are you sure you want to terminate all sessions for this user? They will be logged out from all devices.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, terminate all',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            const userUuid = route.params.userUuid as string;
            if (userUuid) {
                await sessionsStore.terminateAllUserSessions(userUuid);
                showMessage('All sessions terminated successfully.');
            }
        } catch (error: any) {
            console.error('Terminate all sessions error:', error);
            showMessage(error?.message || 'Failed to terminate sessions.', 'error');
        }
    }
};

const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    toast.fire({
        icon: type,
        title: message,
    });
};

const cols = ref([
    { field: 'device_info', title: 'Device' },
    { field: 'ip_address', title: 'IP Address' },
    { field: 'location', title: 'Location' },
    { field: 'last_activity_human', title: 'Last Activity' },
    { field: 'created_at', title: 'Created' },
    { field: 'is_current', title: 'Current', sort: false },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false },
]);
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>