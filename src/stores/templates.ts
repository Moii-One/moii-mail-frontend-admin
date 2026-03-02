import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import { parseApiResponse, parsePaginatedResponse, extractErrorMessage } from '../../../moii-system/src/utils/apiResponse';
import config from '../../config.json';
import type {
    MailTemplate,
    CreateTemplateData,
    UpdateTemplateData,
    TemplateFilters,
    PreviewTemplateData,
    TestTemplateData,
    PaginationData
} from '../types';

export const useTemplatesStore = defineStore('mailTemplates', () => {
    const authStore = useAuthStore();
    
    // State
    const templates = ref<MailTemplate[]>([]);
    const currentTemplate = ref<MailTemplate | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref<PaginationData>({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    });
    const sorting = ref({ sort_by: 'name', sort_direction: 'asc' as 'asc' | 'desc' });

    // Computed
    const activeTemplates = computed(() => 
        templates.value.filter(t => t.is_active)
    );

    const templatesByPackage = computed(() => {
        const grouped: Record<string, MailTemplate[]> = {};
        templates.value.forEach(template => {
            const packages = template.tags?.filter(tag => 
                ['notification', 'auth', 'system'].includes(tag)
            ) || ['other'];
            
            packages.forEach(pkg => {
                if (!grouped[pkg]) {
                    grouped[pkg] = [];
                }
                grouped[pkg].push(template);
            });
        });
        return grouped;
    });

    // Helper function to get auth headers
    const getAuthHeaders = () => {
        const headers = sharedGetAuthHeaders();
        return headers;
    };

    // Actions
    const fetchTemplates = async (params: Record<string, any> = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const queryParams = new URLSearchParams();
            for (const [key, val] of Object.entries(params)) {
                if (val !== null && val !== undefined && val !== '') {
                    // Handle arrays (e.g. tags[])
                    if (Array.isArray(val)) {
                        val.forEach(item => queryParams.append(`${key}[]`, String(item)));
                    } else {
                        queryParams.append(key, String(val));
                    }
                }
            }

            const url = `${config.api_url}/templates${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            const result = await parsePaginatedResponse<MailTemplate>(response);
            templates.value = result.data;
            pagination.value = result.pagination;
        } catch (err) {
            error.value = extractErrorMessage(err);
        } finally {
            loading.value = false;
        }
    };

    const getTemplate = async (id: string | number) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}`;
            
            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            const result = await parseApiResponse<MailTemplate>(response);
            const template = result.data as MailTemplate;
            currentTemplate.value = template;
            return template;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const createTemplate = async (data: CreateTemplateData) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await parseApiResponse<MailTemplate>(response);
            const template = result.data as MailTemplate;
            templates.value.unshift(template);
            return template;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateTemplate = async (id: string | number, data: UpdateTemplateData) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await parseApiResponse<MailTemplate>(response);
            const template = result.data as MailTemplate;
            const index = templates.value.findIndex(t => t.id === template.id);
            if (index !== -1) {
                templates.value[index] = template;
            }
            if (currentTemplate.value?.id === template.id) {
                currentTemplate.value = template;
            }
            return template;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteTemplate = async (id: string | number) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            await parseApiResponse(response);
            templates.value = templates.value.filter(t => t.id !== id);
            if (currentTemplate.value?.id === id) {
                currentTemplate.value = null;
            }
            return true;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const duplicateTemplate = async (id: string | number) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}/duplicate`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            const result = await parseApiResponse<MailTemplate>(response);
            const template = result.data as MailTemplate;
            templates.value.unshift(template);
            return template;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const previewTemplate = async (id: string | number, data: PreviewTemplateData) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}/preview`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await parseApiResponse(response);
            return result.data;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const testTemplate = async (id: string | number, data: TestTemplateData) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${id}/test`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await parseApiResponse(response);
            return result.data;
        } catch (err) {
            error.value = extractErrorMessage(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getTemplateVariables = async (slug: string) => {
        loading.value = true;
        error.value = null;

        try {
            const url = `${config.api_url}/templates/${slug}/variables`;
            
            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            const result = await parseApiResponse(response);
            return result.data;
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
        templates,
        currentTemplate,
        loading,
        error,
        pagination,
        sorting,
        
        // Computed
        activeTemplates,
        templatesByPackage,
        
        // Actions
        fetchTemplates,
        getTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        previewTemplate,
        testTemplate,
        getTemplateVariables,
        updateSorting
    };
});
