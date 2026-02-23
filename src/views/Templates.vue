<template>
    <div>
        <StandardHeader
            title="Email Templates"
            subtitle="Manage email templates used across the platform"
            :navigation-links="navigationLinks"
            :show-add-button="hasPermission('mail.templates.create')"
            add-button-text="Create Template"
            add-button-route="/mail/templates/create"
            :show-refresh="true"
            :show-filters="true"
            @refresh="refreshData"
            @clear-filters="clearFilters"
        >
            <template #actions-before>
                <button v-if="selectedItems.length > 0 && hasPermission('mail.templates.delete')"
                    type="button" class="btn btn-danger" @click="deleteSelectedItems">
                    <IconTrash class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Delete Selected ({{ selectedItems.length }})
                </button>
            </template>
            <template #filters>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Search</label>
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Search templates..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                v-model="filters.search"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Package Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Package</label>
                        <CustomSelect
                            v-model="filters.package"
                            :options="packageOptions"
                            placeholder="All Packages"
                            :searchable="false"
                            :allowEmpty="true"
                        />
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Status</label>
                        <CustomSelect
                            v-model="filters.status"
                            :options="statusOptions"
                            placeholder="All Status"
                            :searchable="false"
                            :allowEmpty="true"
                        />
                    </div>

                    <!-- Tag Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Tag</label>
                        <CustomSelect
                            v-model="filters.tag"
                            :options="tagOptions"
                            placeholder="All Tags"
                            :searchable="true"
                            :allowEmpty="true"
                        />
                    </div>
                </div>
            </template>
        </StandardHeader>

        <!-- Templates Table -->
        <div class="panel p-0 border-0 overflow-hidden mt-5">
            <div class="datatable" v-if="templates.length > 0 || loading">
                <vue3-datatable
                    :rows="templates"
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
                    <template #checkbox="data">
                        <div v-if="!data.value._isEmpty" class="inline-flex" @click.stop>
                            <div class="h-5 w-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer checkbox-custom"
                                :class="isSelected(data.value.id) ? 'checked' : ''"
                                role="checkbox" :aria-checked="isSelected(data.value.id)"
                                @click="toggleSelection(data.value.id)">
                                <svg v-show="isSelected(data.value.id)" class="h-3 w-3 checkmark-icon" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div v-else class="inline-flex" @click.stop>
                            <div class="h-5 w-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer checkbox-custom"
                                :class="isAllSelected ? 'checked' : ''" role="checkbox" :aria-checked="isAllSelected" @click="toggleSelectAll">
                                <svg v-show="isAllSelected" class="h-3 w-3 checkmark-icon" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/>
                                </svg>
                            </div>
                        </div>
                    </template>
                    <template #name="data">
                        <div class="font-semibold">{{ data.value.name }}</div>
                    </template>
                    <template #slug="data">
                        <code class="text-xs">{{ data.value.slug }}</code>
                    </template>
                    <template #subject="data">
                        <div class="max-w-md truncate">{{ data.value.subject }}</div>
                    </template>
                    <template #tags="data">
                        <div class="flex gap-1 flex-wrap">
                            <span 
                                v-for="tag in data.value.tags" 
                                :key="tag"
                                class="badge badge-outline-primary text-xs"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </template>
                    <template #is_active="data">
                        <span 
                            class="badge"
                            :class="data.value.is_active ? 'badge-outline-success' : 'badge-outline-danger'"
                        >
                            {{ data.value.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </template>
                    <template #updated_at="data">
                        <div class="text-sm">{{ formatDate(data.value.updated_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button
                                @click="previewTemplate(data.value)"
                                class="btn btn-outline-secondary btn-sm"
                                title="Preview"
                            >
                                <icon-eye class="w-3 h-3" />
                            </button>
                            <router-link 
                                v-if="hasPermission('mail.templates.edit')"
                                :to="`/mail/templates/${data.value.id}/edit`"
                                class="btn btn-outline-success btn-sm"
                                title="Edit"
                            >
                                <icon-pencil class="w-3 h-3" />
                            </router-link>
                            <button
                                v-if="hasPermission('mail.templates.create')"
                                @click="duplicateTemplate(data.value)"
                                class="btn btn-outline-warning btn-sm"
                                title="Duplicate"
                            >
                                <icon-copy class="w-3 h-3" />
                            </button>
                            <button
                                v-if="hasPermission('mail.templates.delete')"
                                @click="confirmDelete(data.value)"
                                class="btn btn-outline-danger btn-sm"
                                title="Delete"
                            >
                                <icon-trash class="w-3 h-3" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <!-- Empty State -->
            <div v-else class="panel">
                <div class="flex flex-col items-center justify-center py-12">
                    <IconDocument class="w-16 h-16 text-gray-400 mb-4" />
                    <h3 class="text-lg font-semibold mb-2">No templates found</h3>
                    <p class="text-gray-500 mb-4">Create your first email template to get started.</p>
                    <router-link v-if="hasPermission('mail.templates.create')" to="/mail/templates/create" class="btn btn-primary">
                        <IconPlus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Create Template
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Preview Modal -->
        <TemplatePreviewModal
            :show="showPreviewModal"
            :template="selectedTemplate"
            @close="closePreviewModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { useTemplatesStore } from '../stores/templates';
import { useContextStore } from '../../../../packages/moii-users/src/stores/context';
import { usePermissions } from '../../../../src/composables/usePermissions';
import { useToast } from '../composables/useToast';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import TemplatePreviewModal from '../components/TemplatePreviewModal.vue';
import type { MailTemplate } from '../types';
import { StandardHeader, CustomSelect, IconCopy, IconDocument, IconEye, IconPencil, IconPlus, IconSearch, IconTrash } from '../../../moii-ui/src/index';

const templatesStore = useTemplatesStore();
const contextStore = useContextStore();
const { hasPermission } = usePermissions();
const { showToast } = useToast();

// Navigation links
const navigationLinks = [
    { to: '/mail/templates', label: 'Templates' },
    { to: '/mail/logs', label: 'Logs' },
];

// Package options
const packageOptions = [
    { label: 'All Packages', value: '' },
    { label: 'Auth', value: 'auth' },
    { label: 'Notification', value: 'notification' },
    { label: 'System', value: 'system' }
];

// Status options
const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
];

// Tag options
const tagOptions = [
    { label: 'All Tags', value: '' },
    { label: '2FA', value: '2fa' },
    { label: 'Password', value: 'password' },
    { label: 'Registration', value: 'registration' },
    { label: 'Welcome', value: 'welcome' },
    { label: 'Reset', value: 'reset' },
    { label: 'Security', value: 'security' },
    { label: 'Login', value: 'login' },
    { label: 'Temporary', value: 'temporary' }
];

interface TemplatesFilterModel {
    package?: string;
    status?: string;
    tag?: string;
    search?: string;
}

const filters = ref<TemplatesFilterModel>({});

const clearFilters = () => {
    filters.value = {};
};

const refreshData = async () => {
    const apiFilters = buildApiFilters(filters.value, 1, pagination.value.per_page);
    await templatesStore.fetchTemplates(apiFilters);
};
const showPreviewModal = ref(false);
const selectedTemplate = ref<MailTemplate | null>(null);

const templates = computed(() => templatesStore.templates);
const loading = computed(() => templatesStore.loading);
const pagination = computed(() => templatesStore.pagination);

// Bulk selection state
const selectedItems = ref<string[]>([]);
const isAllSelected = computed(() => {
    if (templatesStore.templates.length === 0) return false;
    return selectedItems.value.length === templatesStore.templates.length;
});

// Bulk selection functions
const toggleSelectAll = () => {
    if (isAllSelected.value) { selectedItems.value = []; }
    else { selectedItems.value = templatesStore.templates.map((item: any) => String(item.id)); }
};
const toggleSelection = (id: any) => {
    const strId = String(id);
    const index = selectedItems.value.indexOf(strId);
    if (index > -1) { selectedItems.value.splice(index, 1); }
    else { selectedItems.value.push(strId); }
};
const isSelected = (id: any) => selectedItems.value.includes(String(id));

const deleteSelectedItems = async () => {
    if (selectedItems.value.length === 0) return;
    const result = await Swal.fire({
        title: 'Delete Selected Templates?',
        text: `Are you sure you want to delete ${selectedItems.value.length} template(s)?`,
        icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Yes, delete!', confirmButtonColor: '#dc2626',
        cancelButtonText: 'Cancel', padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    if (result.isConfirmed) {
        try {
            await Promise.all(selectedItems.value.map(id => templatesStore.deleteTemplate(id)));
            showToast(`${selectedItems.value.length} template(s) deleted successfully.`, 'success');
            selectedItems.value = [];
            await refreshData();
        } catch (error) {
            showToast('Failed to delete some templates.', 'error');
        }
    }
};

// Table columns
const cols = ref([
    { field: 'checkbox', title: '', sort: false, width: '40px' },
    { field: 'name', title: 'Name', width: '200px' },
    { field: 'slug', title: 'Slug', width: '200px' },
    { field: 'subject', title: 'Subject', width: '250px' },
    { field: 'tags', title: 'Tags', width: '150px', sort: false },
    { field: 'is_active', title: 'Status', width: '100px' },
    { field: 'updated_at', title: 'Updated', width: '150px' },
    { field: 'actions', title: 'Actions', width: '150px', sort: false },
]);

// Build API filters from UI filters
function buildApiFilters(uiFilters: TemplatesFilterModel, page: number = 1, perPage: number = 10): any {
    const apiFilters: any = {
        page,
        per_page: perPage
    };
    
    if (uiFilters.search) {
        apiFilters.search = uiFilters.search;
    }
    
    // Build tags array from package and tag filters
    const tags: string[] = [];
    if (uiFilters.package) {
        tags.push(uiFilters.package);
    }
    if (uiFilters.tag) {
        tags.push(uiFilters.tag);
    }
    if (tags.length > 0) {
        apiFilters.tags = tags;
    }
    
    if (uiFilters.status) {
        apiFilters.active = uiFilters.status === 'active' ? 1 : 0;
    }
    
    return apiFilters;
}

// Handle changes from datatable (pagination, sorting, etc.)
async function handleChange(event: any) {
    let needsReload = false;

    // Handle sorting
    if (event.sort_column || event.sort_direction) {
        const sortBy = event.sort_column || '';
        const sortDirection = (event.sort_direction || 'asc').toLowerCase() as 'asc' | 'desc';
        const columnMapping: Record<string, string> = {
            'name': 'name',
            'slug': 'slug',
            'subject': 'subject',
            'is_active': 'is_active',
            'updated_at': 'updated_at',
        };
        const backendField = columnMapping[sortBy] || sortBy;
        templatesStore.updateSorting(backendField, sortDirection);
        needsReload = true;
    }

    // Handle pagination
    if (event.current_page || event.pagesize) {
        needsReload = true;
    }

    if (needsReload) {
        const apiFilters = buildApiFilters(filters.value, event.current_page, event.pagesize);
        await templatesStore.fetchTemplates(apiFilters);
    }
}

// Watch filters and apply them
watch(filters, async (newFilters) => {
    const apiFilters = buildApiFilters(newFilters, 1, pagination.value.per_page);
    await templatesStore.fetchTemplates(apiFilters);
}, { deep: true });

// Watch for tenant/app context changes and refetch data
watch([() => contextStore.currentTenantUuid, () => contextStore.currentAppUuid], async () => {
    selectedItems.value = [];
    const apiFilters = buildApiFilters(filters.value, 1, pagination.value.per_page);
    await templatesStore.fetchTemplates(apiFilters);
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

const previewTemplate = (template: MailTemplate) => {
    selectedTemplate.value = template;
    showPreviewModal.value = true;
};

const closePreviewModal = () => {
    showPreviewModal.value = false;
    selectedTemplate.value = null;
};

const duplicateTemplate = async (template: any) => {
    try {
        const duplicateData = {
            name: `${template.name} (Copy)`,
            slug: `${template.slug}-copy-${Date.now()}`,
            subject: template.subject,
            content_html: template.content_html,
            content_text: template.content_text,
            css: template.css,
            from_email: template.from_email,
            from_name: template.from_name,
            reply_to_email: template.reply_to_email,
            reply_to_name: template.reply_to_name,
            tags: template.tags,
            variables: template.variables,
            is_active: false // Duplicate as inactive by default
        };
        
        await templatesStore.createTemplate(duplicateData);
        showToast('Template duplicated successfully', 'success');
        await refreshData();
    } catch (error) {
        console.error('Error duplicating template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate template';
        showToast(errorMessage, 'error');
    }
};

const confirmDelete = async (template: any) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Template?',
        text: `Are you sure you want to delete "${template.name}"? This action cannot be undone!`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });
    
    if (result.isConfirmed) {
        try {
            await templatesStore.deleteTemplate(template.id);
            showToast('Template deleted successfully', 'success');
            await refreshData();
        } catch (error) {
            console.error('Error deleting template:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
            showToast(errorMessage, 'error');
        }
    }
};

onMounted(() => {
    templatesStore.fetchTemplates({ page: 1, per_page: 10 });
});
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}

.checkbox-custom {
    background-color: rgba(255, 255, 255, 0.8);
    border-color: #d1d5db;
    transition: all 0.2s;
}
:deep(.dark) .checkbox-custom {
    background-color: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
}
.checkbox-custom.checked {
    background-color: #1f2937;
    border-color: #1f2937;
}
:deep(.dark) .checkbox-custom.checked {
    background-color: #f3f4f6;
    border-color: #f3f4f6;
}
.checkmark-icon {
    color: #f3f4f6;
}
:deep(.dark) .checkmark-icon {
    color: #1f2937;
}
</style>

<style src="@/assets/css/select2.css"></style>
