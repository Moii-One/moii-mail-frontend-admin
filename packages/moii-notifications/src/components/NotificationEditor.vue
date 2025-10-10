<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Content <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
                <button
                    v-for="template in templates"
                    :key="template.id"
                    @click="applyTemplate(template)"
                    type="button"
                    class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    {{ template.name }}
                </button>
            </div>
        </div>

        <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <quillEditor
                ref="editorRef"
                v-model:value="content"
                :options="editorOptions"
                content-type="html"
                class="min-h-[300px]"
                @update:value="handleContentUpdate"
                @ready="onEditorReady"
            />
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{{ wordCount }} words</span>
            <div class="flex items-center gap-4">
                <button
                    @click="insertVariable"
                    type="button"
                    class="text-primary hover:text-primary-dark"
                >
                    Insert Variable
                </button>
                <button
                    @click="togglePreview"
                    type="button"
                    class="text-primary hover:text-primary-dark"
                >
                    {{ showPreview ? 'Hide' : 'Show' }} Preview
                </button>
            </div>
        </div>

        <!-- Preview Modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="showPreview" @click="togglePreview" class="fixed inset-0 flex items-center justify-center z-[9999] p-4" style="background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px);">
                    <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold">Content Preview</h3>
                            <button
                                @click="togglePreview"
                                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <icon-x class="w-6 h-6" />
                            </button>
                        </div>
                        <div class="prose dark:prose-invert max-w-none" v-html="content"></div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Variables Modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="showVariables" @click="showVariables = false" class="fixed inset-0 flex items-center justify-center z-[9999] p-4" style="background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px);">
                    <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full h-[400px] flex flex-col shadow-2xl">
                        <div class="flex items-center justify-between mb-4 flex-shrink-0">
                            <h3 class="text-lg font-semibold">Insert Variable</h3>
                            <button
                                @click="showVariables = false"
                                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <icon-x class="w-6 h-6" />
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto">
                            <div class="space-y-2">
                                <button
                                    v-for="variable in availableVariables"
                                    :key="variable.key"
                                    @click="insertVariableText(variable.key)"
                                    type="button"
                                    class="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <code class="text-sm">{{ variable.key }}</code> - {{ variable.description }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { quillEditor } from 'vue3-quill';
import 'vue3-quill/lib/vue3-quill.css';
import IconX from './icon/icon-x.vue';

interface Props {
    modelValue: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter your notification content...',
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const content = ref(props.modelValue);
const showPreview = ref(false);
const showVariables = ref(false);
const editorRef = ref();
const quillInstance = ref();

const editorOptions = {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    },
};

const templates = [
    {
        id: 'welcome',
        name: 'Welcome',
        content: '<h2>Welcome to our platform!</h2><p>Dear {{user_name}},</p><p>Welcome to our platform. We\'re excited to have you on board.</p><p>Best regards,<br>The Team</p>',
    },
    {
        id: 'notification',
        name: 'General',
        content: '<h2>New Notification</h2><p>Dear {{user_name}},</p><p>You have a new notification.</p><p>Best regards,<br>The Team</p>',
    },
];

const availableVariables = [
    { key: '{{user_name}}', description: 'User\'s full name' },
    { key: '{{user_email}}', description: 'User\'s email address' },
    { key: '{{user_first_name}}', description: 'User\'s first name' },
    { key: '{{user_last_name}}', description: 'User\'s last name' },
    { key: '{{current_date}}', description: 'Current date' },
    { key: '{{current_time}}', description: 'Current time' },
];

const wordCount = computed(() => {
    if (!content.value) return 0;
    return content.value.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
});

const handleContentUpdate = (newContent: string) => {
    content.value = newContent;
    emit('update:modelValue', newContent);
};

const togglePreview = () => {
    showPreview.value = !showPreview.value;
};

const insertVariable = () => {
    showVariables.value = true;
};

const insertVariableText = (variable: string) => {
    if (quillInstance.value) {
        const quill = quillInstance.value;
        const range = quill.getSelection() || { index: quill.getLength() };
        quill.insertText(range.index, variable);
        content.value = quill.root.innerHTML;
        emit('update:modelValue', content.value);
    }
    showVariables.value = false;
};

const applyTemplate = (template: any) => {
    content.value = template.content;
    emit('update:modelValue', template.content);
};

const onEditorReady = (instance: any) => {
    quillInstance.value = instance;
};

watch(() => props.modelValue, (newValue) => {
    content.value = newValue;
});
</script>

<style scoped>
/* Custom styles for the editor */
:deep(.ql-toolbar) {
    border-top: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    border-bottom: none;
}

:deep(.ql-container) {
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    border-top: none;
}

.dark :deep(.ql-toolbar) {
    border-color: #374151;
}

.dark :deep(.ql-container) {
    border-color: #374151;
}
</style>
