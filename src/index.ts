// ── Types ─────────────────────────────────────────────
export type {
    MailTemplate,
    CreateTemplateData,
    UpdateTemplateData,
    TemplateFilters,
    MailLog,
    MailTracking,
    MailFilters,
    MailStatistics,
    TemplatesResponse,
    MailLogsResponse,
    MailStatsResponse,
    PaginationData,
    TestTemplateData,
    PreviewTemplateData
} from './types';

// Enums (exported as values + types via declaration merging)
export { MailStatus, MailPriority, MailType, TrackingEventType } from './types';

// ── Stores ────────────────────────────────────────────
export { useTemplatesStore } from './stores/templates';
export { useMailStore } from './stores/mail';

// ── Router ────────────────────────────────────────────
export { default as mailRoutes } from './router';

// ── Composables ───────────────────────────────────────
export { useMailStatus } from './composables/useMailStatus';
export { useTemplateVariables } from './composables/useTemplateVariables';

// ── Views ─────────────────────────────────────────────
export { default as Templates } from './views/Templates.vue';
export { default as TemplateForm } from './views/TemplateForm.vue';
export { default as TemplateDetail } from './views/TemplateDetail.vue';
export { default as MailLogs } from './views/MailLogs.vue';
export { default as MailLogDetail } from './views/MailLogDetail.vue';

// ── Default Export (Vue Plugin) ───────────────────────
export default {
    install: (_app: any) => {
        // moii-mail package installed
    }
};
