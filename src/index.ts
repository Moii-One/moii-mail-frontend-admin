// Stores
export { useTemplatesStore } from './stores/templates';
export { useMailStore } from './stores/mail';

// Types
export type {
    MailTemplate,
    CreateTemplateData,
    UpdateTemplateData,
    TemplateFilters,
    MailLog,
    MailTracking,
    MailFilters,
    MailStatistics,
    MailStatus,
    MailPriority,
    MailType,
    TrackingEventType,
    TemplatesResponse,
    MailLogsResponse,
    MailStatsResponse,
    PaginationData,
    TestTemplateData,
    PreviewTemplateData
} from './types';

// Composables
export { useMailStatus } from './composables/useMailStatus';
export { useTemplateVariables } from './composables/useTemplateVariables';

// Router
export { default as mailRoutes } from './router';

// Views
export { default as Templates } from './views/Templates.vue';
export { default as TemplateForm } from './views/TemplateForm.vue';
export { default as TemplateDetail } from './views/TemplateDetail.vue';
export { default as MailLogs } from './views/MailLogs.vue';
export { default as MailLogDetail } from './views/MailLogDetail.vue';

// Components (will be added as we create them)
// export { default as MailHeader } from './components/MailHeader.vue';
// export { default as MailTemplateEditor } from './components/MailTemplateEditor.vue';
// export { default as MailVariablePicker } from './components/MailVariablePicker.vue';
// export { default as MailPreview } from './components/MailPreview.vue';

// Icons (will be added as we create them)
// export { default as IconMail } from './components/icon/icon-mail.vue';
// export { default as IconTemplate } from './components/icon/icon-template.vue';
// export { default as IconEnvelope } from './components/icon/icon-envelope.vue';
// export { default as IconSend } from './components/icon/icon-send.vue';

export default {
    install: (app: any) => {
        console.log('moii-mail package installed');
    }
};
