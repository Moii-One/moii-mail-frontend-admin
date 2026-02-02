import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';
import type {
    MailTemplate,
    CreateTemplateData,
    UpdateTemplateData,
    TemplateFilters,
    TemplatesResponse,
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
    const fetchTemplates = async (filters?: TemplateFilters) => {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams();
            if (filters?.search) params.append('search', filters.search);
            if (filters?.package) params.append('package', filters.package);
            if (filters?.active !== undefined) params.append('active', String(filters.active));
            if (filters?.tags) filters.tags.forEach(tag => params.append('tags[]', tag));
            if (filters?.page) params.append('page', String(filters.page));
            if (filters?.per_page) params.append('per_page', String(filters.per_page));

            const queryString = params.toString();
            const url = `${config.api_url}/templates${queryString ? '?' + queryString : ''}`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                // API returns paginated data with templates in data.data
                templates.value = result.data.data || [];
                
                // Extract pagination info from the paginated response
                pagination.value = {
                    current_page: result.data.current_page || 1,
                    per_page: result.data.per_page || 15,
                    total: result.data.total || 0,
                    last_page: result.data.last_page || 1
                };
            } else {
                throw new Error(result.message || 'Failed to fetch templates');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching templates:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: TemplatesResponse = await response.json();
            
            if (result.success && result.data) {
                currentTemplate.value = result.data;
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: TemplatesResponse = await response.json();
            
            if (result.success && result.data) {
                templates.value.unshift(result.data);
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to create template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: TemplatesResponse = await response.json();
            
            if (result.success && result.data) {
                const index = templates.value.findIndex(t => t.id === result.data!.id);
                if (index !== -1) {
                    templates.value[index] = result.data;
                }
                if (currentTemplate.value?.id === result.data.id) {
                    currentTemplate.value = result.data;
                }
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to update template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                templates.value = templates.value.filter(t => t.id !== id);
                if (currentTemplate.value?.id === id) {
                    currentTemplate.value = null;
                }
                return true;
            } else {
                throw new Error(result.message || 'Failed to delete template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: TemplatesResponse = await response.json();
            
            if (result.success && result.template) {
                templates.value.unshift(result.template);
                return result.template;
            } else {
                throw new Error(result.message || 'Failed to duplicate template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error duplicating template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to preview template');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error previewing template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to send test email');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error testing template:', err);
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch template variables');
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching template variables:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        templates,
        currentTemplate,
        loading,
        error,
        pagination,
        
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
        getTemplateVariables
    };
});
