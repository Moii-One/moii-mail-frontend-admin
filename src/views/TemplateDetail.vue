<template>
    <div>
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">{{ t('mail.detail.title') }}</h5>
                <div class="flex gap-2">
                    <router-link 
                        :to="`/mail/templates/${id}/edit`" 
                        class="btn btn-outline-primary"
                        v-if="hasPermission('mail.templates.edit')"
                    >
                        {{ t('mail.actions.edit') }}
                    </router-link>
                    <router-link to="/mail/templates" class="btn btn-outline-secondary">
                        {{ t('mail.templates.back_to_list') }}
                    </router-link>
                </div>
            </div>

            <div class="mb-5">
                <p class="text-center text-gray-500">
                    📄 {{ t('mail.detail.title') }}
                </p>
                <p class="text-center text-sm text-gray-400 mt-2">
                    {{ t('mail.detail.description') }}
                </p>
                <p class="text-center text-sm text-gray-400">
                    {{ t('mail.detail.in_progress') }} - Phase 1
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
import { useI18n } from '../../../moii-localizations/src/composables/useI18n';

const props = defineProps<{
    id: string;
}>();

const templatesStore = useTemplatesStore();
const { hasPermission } = usePermissions();
const { t } = useI18n();

onMounted(async () => {
    if (props.id) {
        await templatesStore.getTemplate(props.id);
    }
});
</script>
