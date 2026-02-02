<template>
    <div>
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">Template Details</h5>
                <div class="flex gap-2">
                    <router-link 
                        :to="`/mail/templates/${id}/edit`" 
                        class="btn btn-outline-primary"
                        v-if="hasPermission('mail.templates.edit')"
                    >
                        Edit
                    </router-link>
                    <router-link to="/mail/templates" class="btn btn-outline-secondary">
                        Back to List
                    </router-link>
                </div>
            </div>

            <div class="mb-5">
                <p class="text-center text-gray-500">
                    📄 Template Details View
                </p>
                <p class="text-center text-sm text-gray-400 mt-2">
                    Detailed view of email template with preview and testing capabilities.
                </p>
                <p class="text-center text-sm text-gray-400">
                    Implementation in progress - Phase 1
                </p>
            </div>

            <!-- TODO: Implement template detail view -->
            <!-- Features to implement:
                - Template metadata display
                - HTML/Text content display
                - Available variables list
                - Used by packages badge
                - Usage statistics
                - Recent emails sent
                - Preview button
                - Test template button
                - Duplicate button
                - Delete button
                - Export button
            -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTemplatesStore } from '../stores/templates';
import { usePermissions } from '../../../../src/composables/usePermissions';

const props = defineProps<{
    id: string;
}>();

const templatesStore = useTemplatesStore();
const { hasPermission } = usePermissions();

onMounted(async () => {
    if (props.id) {
        await templatesStore.getTemplate(props.id);
    }
});
</script>
