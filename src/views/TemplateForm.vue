<template>
    <div>
        <!-- Page Header -->
        <div class="panel flex items-center justify-between mb-5">
            <div class="flex items-center gap-4">
                <router-link 
                    to="/mail/templates" 
                    class="btn btn-outline-primary"
                    title="Back to Templates"
                >
                    <icon-arrow-backward class="w-5 h-5" />
                </router-link>
                <div>
                    <h5 class="font-semibold text-lg dark:text-white-light">
                        {{ isEditMode ? 'Edit' : 'Create' }} Email Template
                    </h5>
                    <div class="flex items-center gap-2 text-sm text-white-dark mt-1">
                        <router-link to="/mail/templates" class="hover:text-primary">Email Templates</router-link>
                        <span>/</span>
                        <span>{{ isEditMode ? 'Edit' : 'Create' }}</span>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button 
                    type="button" 
                    @click="openPreview" 
                    class="btn btn-outline-secondary"
                >
                    <icon-eye class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Preview
                </button>
                <router-link to="/mail/templates" class="btn btn-outline-danger">
                    Cancel
                </router-link>
                <button 
                    type="button" 
                    @click="handleSubmit" 
                    class="btn btn-primary" 
                    :disabled="templatesStore.loading"
                >
                    <span v-if="templatesStore.loading" class="inline-block w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin ltr:mr-2 rtl:ml-2"></span>
                    <icon-save class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    {{ isEditMode ? 'Update' : 'Create' }}
                </button>
            </div>
        </div>

        <!-- Form -->
        <div class="panel">
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block mb-1">Template Name <span class="text-danger">*</span></label>
                        <input
                            id="name"
                            v-model="form.name"
                            type="text"
                            class="form-input"
                            placeholder="e.g., Welcome Email"
                            required
                        />
                    </div>

                    <!-- Slug -->
                    <div>
                        <label for="slug" class="block mb-1">Slug <span class="text-danger">*</span></label>
                        <input
                            id="slug"
                            v-model="form.slug"
                            type="text"
                            class="form-input"
                            placeholder="e.g., welcome-email"
                            required
                        />
                    </div>
                </div>

                <!-- Subject -->
                <div>
                    <label for="subject" class="block mb-1">Email Subject <span class="text-danger">*</span></label>
                    <input
                        id="subject"
                        v-model="form.subject"
                        type="text"
                        class="form-input"
                        placeholder="e.g., Welcome to {{ app_name }}"
                        required
                    />
                </div>

                <!-- HTML Content -->
                <div>
                    <label for="content_html" class="block mb-1">HTML Content</label>
                    <textarea
                        id="content_html"
                        v-model="form.content_html"
                        rows="10"
                        class="form-textarea font-mono text-sm"
                        placeholder="Enter HTML email content..."
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Use &#123;&#123; variable_name &#125;&#125; or &#123;&#123; $object-&gt;property &#125;&#125; for template variables</p>
                </div>

                <!-- CSS Styles -->
                <div>
                    <label for="css" class="block mb-1">CSS Styles</label>
                    <textarea
                        id="css"
                        v-model="form.css"
                        rows="6"
                        class="form-textarea font-mono text-sm"
                        placeholder="Enter CSS styles (will be injected in <style> tag)..."
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">CSS will be embedded in the email's &lt;head&gt; section</p>
                </div>

                <!-- Plain Text Content -->
                <div>
                    <label for="content_text" class="block mb-1">Plain Text Content</label>
                    <textarea
                        id="content_text"
                        v-model="form.content_text"
                        rows="8"
                        class="form-textarea"
                        placeholder="Enter plain text email content..."
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Fallback for email clients that don't support HTML</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- From Email -->
                    <div>
                        <label for="from_email" class="block mb-1">From Email</label>
                        <input
                            id="from_email"
                            v-model="form.from_email"
                            type="email"
                            class="form-input"
                            placeholder="noreply@example.com"
                        />
                    </div>

                    <!-- From Name -->
                    <div>
                        <label for="from_name" class="block mb-1">From Name</label>
                        <input
                            id="from_name"
                            v-model="form.from_name"
                            type="text"
                            class="form-input"
                            placeholder="Your App Name"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Reply To Email -->
                    <div>
                        <label for="reply_to_email" class="block mb-1">Reply-To Email</label>
                        <input
                            id="reply_to_email"
                            v-model="form.reply_to_email"
                            type="email"
                            class="form-input"
                            placeholder="support@example.com"
                        />
                    </div>

                    <!-- Reply To Name -->
                    <div>
                        <label for="reply_to_name" class="block mb-1">Reply-To Name</label>
                        <input
                            id="reply_to_name"
                            v-model="form.reply_to_name"
                            type="text"
                            class="form-input"
                            placeholder="Support Team"
                        />
                    </div>
                </div>

                <!-- Tags -->
                <div>
                    <label class="block mb-1">Tags</label>
                    <input
                        v-model="newTag"
                        type="text"
                        class="form-input"
                        placeholder="Add tag and press Enter"
                        @keydown.enter.prevent="addTag"
                    />
                    <div v-if="form.tags && form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <span 
                            v-for="(tag, index) in form.tags" 
                            :key="index"
                            class="badge bg-primary flex items-center gap-1"
                        >
                            {{ tag }}
                            <button 
                                type="button"
                                @click="removeTag(index)"
                                class="hover:text-danger"
                            >
                                ×
                            </button>
                        </span>
                    </div>
                </div>

                <!-- Variables (for documentation and testing) -->
                <div>
                    <label for="variables" class="block mb-1">Template Variables (JSON)</label>
                    <textarea
                        id="variables"
                        v-model="variablesJson"
                        rows="4"
                        class="form-textarea font-mono text-xs"
                        placeholder='{\n  "user_name": "User full name",\n  "code": "Verification code",\n  "app_name": "Application name"\n}'
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Define variables that can be used in this template (e.g., {{ user_name }}). Used for documentation and testing.</p>
                </div>

                <!-- Version Display (read-only) -->
                <div v-if="isEditMode">
                    <label class="block mb-1">Template Version</label>
                    <div class="form-input bg-gray-100 dark:bg-gray-800 cursor-not-allowed">
                        Version {{ templatesStore.currentTemplate?.version || 1 }}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Version is automatically incremented on each update</p>
                </div>

                <!-- Active Status -->
                <div>
                    <label class="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            v-model="form.is_active"
                            class="form-checkbox"
                        />
                        <span class="ltr:ml-2 rtl:mr-2">Active (template is ready to use)</span>
                    </label>
                </div>

            </form>
        </div>

        <!-- Preview Modal -->
        <TemplatePreviewModal
            :show="showPreviewModal"
            :template="previewTemplate"
            @close="closePreviewModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplatesStore } from '../stores/templates';
import { useToast } from '../composables/useToast';
import type { CreateTemplateData, MailTemplate } from '../types';
import TemplatePreviewModal from '../components/TemplatePreviewModal.vue';
import IconArrowBackward from '../../../../src/components/icon/icon-arrow-backward.vue';
import IconSave from '../../../../src/components/icon/icon-save.vue';
import IconEye from '../../../../src/components/icon/icon-eye.vue';

const route = useRoute();
const router = useRouter();
const templatesStore = useTemplatesStore();
const { showToast } = useToast();

const showPreviewModal = ref(false);

const props = defineProps<{
    id?: string;
}>();

const isEditMode = computed(() => !!props.id);

const form = ref<CreateTemplateData>({
    name: '',
    slug: '',
    subject: '',
    content_html: '',
    content_text: '',
    css: '',
    from_email: '',
    from_name: '',
    reply_to_email: '',
    reply_to_name: '',
    tags: [],
    is_active: true
});

const newTag = ref('');
const variablesJson = ref('');

const previewTemplate = computed<MailTemplate | null>(() => {
    // Parse variables for preview
    let variables: Record<string, string> | undefined;
    if (variablesJson.value.trim()) {
        try {
            variables = JSON.parse(variablesJson.value);
        } catch (e) {
            variables = undefined;
        }
    }

    return {
        id: props.id ? parseInt(props.id) : 0,
        uuid: '',
        name: form.value.name,
        slug: form.value.slug,
        subject: form.value.subject,
        content_html: form.value.content_html,
        content_text: form.value.content_text,
        css: form.value.css,
        from_email: form.value.from_email,
        from_name: form.value.from_name,
        reply_to_email: form.value.reply_to_email,
        reply_to_name: form.value.reply_to_name,
        tags: form.value.tags,
        variables: variables,
        version: templatesStore.currentTemplate?.version || 1,
        is_active: form.value.is_active || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    } as MailTemplate;
});

const openPreview = () => {
    showPreviewModal.value = true;
};

const closePreviewModal = () => {
    showPreviewModal.value = false;
};

const addTag = () => {
    const tag = newTag.value.trim();
    if (tag && !form.value.tags?.includes(tag)) {
        if (!form.value.tags) form.value.tags = [];
        form.value.tags.push(tag);
        newTag.value = '';
    }
};

const removeTag = (index: number) => {
    if (form.value.tags) {
        form.value.tags.splice(index, 1);
    }
};

const handleSubmit = async () => {
    try {
        // Parse variables JSON if provided
        let variables: Record<string, string> | undefined;
        if (variablesJson.value.trim()) {
            try {
                variables = JSON.parse(variablesJson.value);
            } catch (e) {
                showToast('Invalid JSON in variables field', 'error');
                return;
            }
        }

        const submitData = {
            ...form.value,
            variables
        };

        if (isEditMode.value && props.id) {
            await templatesStore.updateTemplate(props.id, submitData);
            showToast('Template updated successfully', 'success');
        } else {
            await templatesStore.createTemplate(submitData);
            showToast('Template created successfully', 'success');
        }
        router.push('/mail/templates');
    } catch (error) {
        console.error('Error saving template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save template';
        showToast(errorMessage, 'error');
    }
};

onMounted(async () => {
    if (isEditMode.value && props.id) {
        await templatesStore.getTemplate(props.id);
        const template = templatesStore.currentTemplate;
        if (template) {
            form.value = {
                name: template.name,
                slug: template.slug,
                subject: template.subject,
                content_html: template.content_html || '',
                content_text: template.content_text || '',
                css: template.css || '',
                from_email: template.from_email || '',
                from_name: template.from_name || '',
                reply_to_email: template.reply_to_email || '',
                reply_to_name: template.reply_to_name || '',
                tags: template.tags || [],
                is_active: template.is_active
            };
            // Load variables as JSON string
            if (template.variables) {
                variablesJson.value = JSON.stringify(template.variables, null, 2);
            }
        }
    }
});
</script>
