<template>
    <div class="session-management">
        <h3 class="text-lg font-semibold mb-4">Active Sessions</h3>
        
        <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading sessions...</p>
        </div>

        <div v-else>
            <div class="space-y-4">
                <div 
                    v-for="session in sessions" 
                    :key="session.uuid"
                    class="border rounded-lg p-4 bg-white shadow-sm"
                    :class="{ 'border-primary bg-primary/5': session.is_current }"
                >
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="text-2xl">{{ getDeviceIcon(session.device_type) }}</span>
                                <div>
                                    <h4 class="font-medium">{{ session.device_name }}</h4>
                                    <p class="text-sm text-gray-600">
                                        {{ session.browser }} on {{ session.os }}
                                    </p>
                                </div>
                                <span v-if="session.is_current" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Current Session
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                    <strong>IP Address:</strong> {{ session.ip_address }}
                                </div>
                                <div v-if="session.location">
                                    <strong>Location:</strong> {{ session.location }}
                                </div>
                                <div>
                                    <strong>Last Activity:</strong> {{ formatDate(session.last_activity) }}
                                </div>
                                <div>
                                    <strong>Expires:</strong> {{ formatDate(session.expires_at) }}
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            v-if="!session.is_current"
                            @click="terminateSession(session.uuid)"
                            :disabled="terminating"
                            class="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            :class="{ 'opacity-50 cursor-not-allowed': terminating }"
                        >
                            {{ terminating ? 'Terminating...' : 'Terminate' }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                    @click="terminateOtherSessions"
                    :disabled="terminating"
                    class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': terminating }"
                >
                    {{ terminating ? 'Processing...' : 'Terminate Other Sessions' }}
                </button>
                
                <button 
                    @click="terminateAllSessions"
                    :disabled="terminating"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': terminating }"
                >
                    {{ terminating ? 'Processing...' : 'Terminate All Sessions' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

interface UserSession {
    uuid: string;
    device_name: string;
    device_type: string;
    browser: string;
    os: string;
    ip_address: string;
    location?: string;
    last_activity: string;
    expires_at: string;
    is_current: boolean;
}

const authStore = useAuthStore();
const loading = ref(false);
const terminating = ref(false);
const sessions = ref<UserSession[]>([]);

const loadSessions = async () => {
    loading.value = true;
    try {
        const result = await authStore.getActiveSessions();
        if (result.success) {
            sessions.value = result.sessions;
        }
    } finally {
        loading.value = false;
    }
};

const terminateSession = async (sessionUuid: string) => {
    terminating.value = true;
    try {
        const result = await authStore.terminateSession(sessionUuid);
        if (result.success) {
            await loadSessions(); // Reload sessions
        }
    } finally {
        terminating.value = false;
    }
};

const terminateOtherSessions = async () => {
    terminating.value = true;
    try {
        const result = await authStore.terminateOtherSessions();
        if (result.success) {
            await loadSessions(); // Reload sessions
        }
    } finally {
        terminating.value = false;
    }
};

const terminateAllSessions = async () => {
    if (confirm('Are you sure you want to terminate all sessions? You will be logged out.')) {
        terminating.value = true;
        try {
            await authStore.terminateAllSessions();
            // User will be redirected to login automatically
        } finally {
            terminating.value = false;
        }
    }
};

const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
        case 'mobile': return '📱';
        case 'tablet': return '📺';
        case 'desktop': return '💻';
        default: return '🖥️';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

onMounted(() => {
    loadSessions();
});
</script>

<style scoped>
.session-management {
    max-width: 1024px;
    margin: 0 auto;
}
</style>
