import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/mail/templates',
        name: 'mail-templates',
        component: () => import('../views/Templates.vue'),
        meta: {
            title: 'Email Templates',
            requiresAuth: true,
            permissions: ['mail.templates.view']
        }
    },
    {
        path: '/mail/templates/create',
        name: 'mail-templates-create',
        component: () => import('../views/TemplateForm.vue'),
        meta: {
            title: 'Create Email Template',
            requiresAuth: true,
            permissions: ['mail.templates.create']
        }
    },
    {
        path: '/mail/templates/:id/edit',
        name: 'mail-templates-edit',
        component: () => import('../views/TemplateForm.vue'),
        meta: {
            title: 'Edit Email Template',
            requiresAuth: true,
            permissions: ['mail.templates.edit']
        },
        props: true
    },
    {
        path: '/mail/templates/:id',
        name: 'mail-templates-show',
        component: () => import('../views/TemplateDetail.vue'),
        meta: {
            title: 'Email Template Details',
            requiresAuth: true,
            permissions: ['mail.templates.view']
        },
        props: true
    },
    {
        path: '/mail/logs',
        name: 'mail-logs',
        component: () => import('../views/MailLogs.vue'),
        meta: {
            title: 'Mail Logs',
            requiresAuth: true,
            permissions: ['mail.view']
        }
    },
    {
        path: '/mail/logs/:id',
        name: 'mail-logs-show',
        component: () => import('../views/MailLogDetail.vue'),
        meta: {
            title: 'Mail Log Details',
            requiresAuth: true,
            permissions: ['mail.view']
        },
        props: true
    }
];

export default routes;
