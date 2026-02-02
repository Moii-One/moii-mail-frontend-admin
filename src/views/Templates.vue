<template>
    <div>
        <TemplatesHeader
            title="Email Templates"
            v-model="filters"
        />

        <!-- Templates Table -->
        <div class="panel p-0 border-0 overflow-hidden mt-5">
            <div class="datatable">
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
import TemplatesHeader from '../components/TemplatesHeader.vue';
import TemplatePreviewModal from '../components/TemplatePreviewModal.vue';
import type { TemplatesFilterModel } from '../components/TemplatesHeader.vue';
import type { MailTemplate } from '../types';
import IconEye from '../../../../src/components/icon/icon-eye.vue';
import IconPencil from '../../../../src/components/icon/icon-pencil.vue';
import IconTrash from '../../../../src/components/icon/icon-trash.vue';
import IconCopy from '../../../../src/components/icon/icon-copy.vue';

const templatesStore = useTemplatesStore();
const contextStore = useContextStore();
const { hasPermission } = usePermissions();
const { showToast } = useToast();

const filters = ref<TemplatesFilterModel>({});
const showPreviewModal = ref(false);
const selectedTemplate = ref<MailTemplate | null>(null);

const templates = computed(() => templatesStore.templates);
const loading = computed(() => templatesStore.loading);
const pagination = computed(() => templatesStore.pagination);

// Table columns
const cols = ref([
    { field: 'name', title: 'Name', width: '200px' },
    { field: 'slug', title: 'Slug', width: '200px' },
    { field: 'subject', title: 'Subject', width: '250px' },
    { field: 'tags', title: 'Tags', width: '150px' },
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
async function handleChange(data: any) {
    const apiFilters = buildApiFilters(filters.value, data.current_page, data.pagesize);
    await templatesStore.fetchTemplates(apiFilters);
}

// Watch filters and apply them
watch(filters, async (newFilters) => {
    const apiFilters = buildApiFilters(newFilters, 1, pagination.value.per_page);
    await templatesStore.fetchTemplates(apiFilters);
}, { deep: true });

// Watch for tenant/app context changes and refetch data
watch([() => contextStore.currentTenantUuid, () => contextStore.currentAppUuid], async () => {
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

/* Fix multiselect dropdown z-index */
.custom-multiselect-wrapper {
    position: relative;
    z-index: 50;
}

.custom-multiselect .multiselect__content-wrapper {
    z-index: 100 !important;
}
</style>

<style src="@/assets/css/select2.css"></style>
