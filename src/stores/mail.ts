import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';
import type {
    MailLog,
    MailFilters,
    MailStatistics,
    MailLogsResponse,
    MailStatsResponse,
    PaginationData
} from '../types';

export const useMailStore = defineStore('mail', () => {
    const authStore = useAuthStore();
    
    // State
    const mailLogs = ref<MailLog[]>([]);
    const currentMail = ref<MailLog | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const stats = ref<MailStatistics | null>(null);
    const pagination = ref<PaginationData>({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    });

    // Computed
    const sentMails = computed(() => 
        mailLogs.value.filter(m => m.status === 'sent' || m.status === 'delivered')
    );

    const failedMails = computed(() => 
        mailLogs.value.filter(m => m.status === 'failed' || m.status === 'bounced')
    );

    const pendingMails = computed(() => 
        mailLogs.value.filter(m => m.status === 'pending')
    );

    const mailsByStatus = computed(() => {
        const grouped: Record<string, MailLog[]> = {
            pending: [],
            sent: [],
            delivered: [],
            failed: [],
            bounced: []
        };
        
        mailLogs.value.forEach(mail => {
            if (grouped[mail.status]) {
                grouped[mail.status].push(mail);
            }
        });
        
        return grouped;
    });

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const headers = sharedGetAuthHeaders();
        return headers;
    };

    // Actions
    const fetchMailLogs = async (filters?: MailFilters) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams();
            if (filters?.search) params.append('search', filters.search);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.template_id) params.append('template_id', String(filters.template_id));
            if (filters?.package) params.append('package', filters.package);
            if (filters?.date_from) params.append('date_from', filters.date_from);
            if (filters?.date_to) params.append('date_to', filters.date_to);
            if (filters?.page) params.append('page', String(filters.page));
            if (filters?.per_page) params.append('per_page', String(filters.per_page));

            const queryString = params.toString();
            const url = `${config.api_url}/logs${queryString ? '?' + queryString : ''}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                mailLogs.value = result.data;
                // Handle pagination from new format
                pagination.value = {
                    current_page: result.current_page || 1,
                    per_page: result.per_page || 10,
                    total: result.total || 0,
                    last_page: result.last_page || 1
                };
            } else {
                throw new Error(result.message || 'Failed to fetch mail logs');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching mail logs:', err);
        } finally {
            loading.value = false;
        }
    };

    const getMailLog = async (id: string | number) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/${id}`;
            
            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: MailLogsResponse = await response.json();
            
            if (result.success && result.mail) {
                currentMail.value = result.mail;
                return result.mail;
            } else {
                throw new Error(result.message || 'Failed to fetch mail log');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching mail log:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getStats = async (filters?: Partial<MailFilters>) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams();
            if (filters?.template_id) params.append('template_id', String(filters.template_id));
            if (filters?.package) params.append('package', filters.package);
            if (filters?.date_from) params.append('date_from', filters.date_from);
            if (filters?.date_to) params.append('date_to', filters.date_to);

            const queryString = params.toString();
            const url = `${config.api_url}/stats${queryString ? '?' + queryString : ''}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: MailStatsResponse = await response.json();
            
            if (result.success && result.data) {
                stats.value = result.data;
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch statistics');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching stats:', err);
        } finally {
            loading.value = false;
        }
    };

    const retryMail = async (id: string | number) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/${id}/retry`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Refresh the mail log
                await getMailLog(id);
                return true;
            } else {
                throw new Error(result.message || 'Failed to retry email');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error retrying email:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        mailLogs,
        currentMail,
        loading,
        error,
        stats,
        pagination,
        
        // Computed
        sentMails,
        failedMails,
        pendingMails,
        mailsByStatus,
        
        // Actions
        fetchMailLogs,
        getMailLog,
        getStats,
        retryMail
    };
});
