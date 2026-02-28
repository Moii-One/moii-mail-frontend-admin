<template>
    <div>
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">{{ t('mail.logs.details') }}</h5>
                <router-link to="/mail/logs" class="btn btn-outline-secondary">
                    {{ t('mail.logs.back') }}
                </router-link>
            </div>

            <div class="mb-5">
                <p class="text-center text-gray-500">
                    📧 {{ t('mail.logs.email_details') }}
                </p>
                <p class="text-center text-sm text-gray-400 mt-2">
                    {{ t('mail.logs.details_desc') }}
                </p>
                <p class="text-center text-sm text-gray-400">
                    {{ t('mail.logs.in_progress') }} - Phase 2
                </p>
            </div>

            <!-- TODO: Implement mail log detail view -->
            <!-- Features to implement:
                - Email metadata (subject, from, to, cc, bcc)
                - Template used (link to template)
                - Status and timestamps
                - Email content preview (HTML)
                - Tracking information (opens, clicks)
                - Error message (if failed)
                - Provider information
                - Retry button (if failed)
                - View full headers
                - Related scheduled mail
            -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useMailStore } from '../stores/mail';
import { useI18n } from '../../../moii-localizations/src/composables/useI18n';

const props = defineProps<{
    id: string;
}>();

const mailStore = useMailStore();
const { t } = useI18n();

onMounted(async () => {
    if (props.id) {
        await mailStore.getMailLog(props.id);
    }
});
</script>
