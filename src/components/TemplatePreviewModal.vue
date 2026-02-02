<template>
    <teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[999] overflow-y-auto"
        >
            <div class="flex min-h-screen items-center justify-center px-4">
                <div class="fixed inset-0 bg-black/60" @click="closeModal"></div>
                <div class="panel relative z-10 w-full max-w-5xl overflow-hidden rounded-lg bg-white dark:bg-[#0e1726]">
                    <!-- Modal Header -->
                    <div class="flex items-center justify-between border-b border-white-light dark:border-[#1b2e4b] px-5 py-3">
                        <h5 class="text-lg font-semibold">Template Preview</h5>
                        <button type="button" class="text-white-dark hover:text-dark" @click="closeModal">
                            <icon-x class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-5">
                        <!-- Template Info -->
                        <div class="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="font-semibold">Template:</span> {{ template.name }}
                                </div>
                                <div>
                                    <span class="font-semibold">Subject:</span> {{ renderedSubject }}
                                </div>
                            </div>
                        </div>

                        <!-- Variables Section (if available) -->
                        <div v-if="hasVariables" class="mb-4">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold text-sm">Test Variables:</label>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary"
                                    @click="showVariablesEditor = !showVariablesEditor"
                                >
                                    {{ showVariablesEditor ? 'Hide' : 'Edit' }} Variables
                                </button>
                            </div>
                            
                            <div v-if="showVariablesEditor" class="mb-3">
                                <textarea
                                    v-model="testVariablesJson"
                                    rows="4"
                                    class="form-textarea font-mono text-xs"
                                    placeholder="Enter test variables as JSON"
                                ></textarea>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-primary mt-2"
                                    @click="updatePreview"
                                >
                                    Update Preview
                                </button>
                            </div>
                            
                            <div v-else class="flex flex-wrap gap-2">
                                <span
                                    v-for="(value, key) in testVariables"
                                    :key="key"
                                    class="badge bg-info text-xs"
                                >
                                    {{ key }}: {{ value }}
                                </span>
                            </div>
                        </div>

                        <!-- HTML Preview -->
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div class="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-700">
                                HTML Preview
                            </div>
                            <div class="p-4 bg-white dark:bg-gray-900 overflow-auto" style="max-height: 500px;">
                                <iframe
                                    ref="previewFrame"
                                    class="w-full border-0"
                                    style="min-height: 400px;"
                                    sandbox="allow-same-origin"
                                ></iframe>
                            </div>
                        </div>

                        <!-- Plain Text Preview (if available) -->
                        <div v-if="template.content_text" class="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div class="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-700">
                                Plain Text Preview
                            </div>
                            <div class="p-4 bg-white dark:bg-gray-900">
                                <pre class="text-sm whitespace-pre-wrap font-mono">{{ renderedText }}</pre>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="flex items-center justify-end gap-2 border-t border-white-light dark:border-[#1b2e4b] px-5 py-3">
                        <button type="button" class="btn btn-outline-danger" @click="closeModal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import IconX from '../../../../src/components/icon/icon-x.vue';
import type { MailTemplate } from '../types';

interface Props {
    show: boolean;
    template: MailTemplate | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'close'): void;
}>();

const previewFrame = ref<HTMLIFrameElement | null>(null);
const showVariablesEditor = ref(false);
const testVariablesJson = ref('');
const testVariables = ref<Record<string, any>>({});

const hasVariables = computed(() => {
    return props.template?.variables && Object.keys(props.template.variables).length > 0;
});

const renderedSubject = computed(() => {
    if (!props.template?.subject) return '';
    return replaceVariables(props.template.subject);
});

const renderedHtml = computed(() => {
    if (!props.template?.content_html) return '<p>No HTML content available</p>';
    return replaceVariables(props.template.content_html);
});

const renderedText = computed(() => {
    if (!props.template?.content_text) return '';
    return replaceVariables(props.template.content_text);
});

function replaceVariables(content: string): string {
    let result = content;
    
    // Replace variables with test values
    // Handle both {{ variable }} and {{ $object->property }} syntax
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
        expression = expression.trim();
        
        // Remove dollar sign if present
        expression = expression.replace(/^\$/, '');
        
        // Handle ?? operator for default values
        const parts = expression.split('??').map(p => p.trim());
        const varPath = parts[0];
        const defaultValue = parts[1] ? parts[1].replace(/^['"]|['"]$/g, '') : '';
        
        // Handle object property access (e.g., user->first_name)
        if (varPath.includes('->')) {
            const pathParts = varPath.split('->');
            let value: any = testVariables.value;
            
            for (const part of pathParts) {
                if (value && typeof value === 'object' && part in value) {
                    value = value[part];
                } else {
                    return defaultValue || match;
                }
            }
            
            return String(value);
        }
        
        // Handle simple variable access
        if (varPath in testVariables.value) {
            return String(testVariables.value[varPath]);
        }
        
        // Return default value or original if not found
        return defaultValue || match;
    });
    
    return result;
}

function updatePreview() {
    try {
        if (testVariablesJson.value.trim()) {
            testVariables.value = JSON.parse(testVariablesJson.value);
        } else {
            testVariables.value = {};
        }
        showVariablesEditor.value = false;
        renderPreview();
    } catch (e) {
        alert('Invalid JSON format');
    }
}

function renderPreview() {
    nextTick(() => {
        if (previewFrame.value && previewFrame.value.contentWindow) {
            const doc = previewFrame.value.contentWindow.document;
            doc.open();
            
            // Build complete HTML with CSS
            let html = renderedHtml.value;
            
            // If CSS is provided, wrap HTML with proper structure
            if (props.template?.css) {
                html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
${props.template.css}
    </style>
</head>
<body>
${html}
</body>
</html>`;
            }
            
            doc.write(html);
            doc.close();
            
            // Auto-adjust iframe height
            setTimeout(() => {
                if (previewFrame.value && previewFrame.value.contentWindow) {
                    const height = previewFrame.value.contentWindow.document.body.scrollHeight;
                    previewFrame.value.style.height = `${Math.max(height, 400)}px`;
                }
            }, 100);
        }
    });
}

function closeModal() {
    emit('close');
}

// Initialize test variables from template
watch(() => props.show, (newVal) => {
    if (newVal && props.template) {
        // Initialize test variables
        if (props.template.variables && Object.keys(props.template.variables).length > 0) {
            // Create sample values based on variable descriptions
            const sampleVars: Record<string, any> = {};
            for (const [key, description] of Object.entries(props.template.variables)) {
                const keyLower = key.toLowerCase();
                
                // Handle nested object syntax (e.g., "user" object with properties)
                if (key === 'user') {
                    sampleVars[key] = {
                        first_name: 'John',
                        last_name: 'Doe',
                        name: 'John Doe',
                        email: 'john@example.com'
                    };
                } else if (keyLower.includes('name')) {
                    sampleVars[key] = 'John Doe';
                } else if (keyLower.includes('email')) {
                    sampleVars[key] = 'john@example.com';
                } else if (keyLower.includes('code')) {
                    sampleVars[key] = '12345678';
                } else if (keyLower.includes('url') || keyLower.includes('link')) {
                    sampleVars[key] = 'https://example.com';
                } else if (keyLower.includes('date')) {
                    sampleVars[key] = new Date().toLocaleDateString();
                } else if (keyLower.includes('time') || keyLower.includes('minute') || keyLower.includes('expires')) {
                    sampleVars[key] = '10';
                } else {
                    sampleVars[key] = `Sample ${key}`;
                }
            }
            testVariables.value = sampleVars;
            testVariablesJson.value = JSON.stringify(sampleVars, null, 2);
        } else {
            testVariables.value = {};
            testVariablesJson.value = '';
        }
        
        // Render preview
        renderPreview();
    }
}, { immediate: true });

// Re-render when template changes
watch(() => props.template, () => {
    if (props.show) {
        renderPreview();
    }
}, { deep: true });
</script>
