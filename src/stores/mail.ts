import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import { parseApiResponse, parsePaginatedResponse, extractErrorMessage } from '../../../moii-system/src/utils/apiResponse';
import _config from '../../config.json';
import { getPackageConfig } from '../../../moii-system/src/utils/packageConfig';
import type {
    MailLog,
    MailFilters,
    MailStatistics,
    PaginationData
} from '../types';

export const useMailStore = defineStore('mail', () => {
    const config = getPackageConfig('moii-mail', _config);
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
    const sorting = ref({ sort_by: 'created_at', sort_direction: 'desc' as 'asc' | 'desc' });

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
    const fetchMailLogs = async (params: Record<string, any> = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const queryParams = new URLSearchParams();
            for (const [key, val] of Object.entries(params)) {
                if (val !== null && val !== undefined && val !== '') {
                    queryParams.append(key, String(val));
                }
            }

            const url = `${config.api_url}/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            const result = await parsePaginatedResponse<MailLog>(response);
            mailLogs.value = result.data;
            pagination.value = result.pagination;
        } catch (err) {
            error.value = extractErrorMessage(err);
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

            const result = await parseApiResponse<MailLog>(response);
            currentMail.value = result.data ?? null;
            return result.data!;
        } catch (err) {
            error.value = extractErrorMessage(err);
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

            const result = await parseApiResponse<MailStatistics>(response);
            stats.value = result.data ?? null;
            return result.data;
        } catch (err) {
            error.value = extractErrorMessage(err);
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

            await parseApiResponse(response);
            // Refresh the mail log
            await getMailLog(id);
            return true;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateSorting = (sort_by: string, sort_direction: 'asc' | 'desc') => {
        sorting.value.sort_by = sort_by;
        sorting.value.sort_direction = sort_direction;
    };

    return {
        // State
        mailLogs,
        currentMail,
        loading,
        error,
        stats,
        pagination,
        sorting,
        
        // Computed
        sentMails,
        failedMails,
        pendingMails,
        mailsByStatus,
        
        // Actions
        fetchMailLogs,
        getMailLog,
        getStats,
        retryMail,
        updateSorting
    };
});
