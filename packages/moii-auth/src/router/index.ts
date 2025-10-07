import { RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';

const getLayout = () => {
    const store = useAppStore();
    return store.layout;
};

export const authRoutes: RouteRecordRaw[] = [
    // authentication
    {
        path: '/login',
        name: 'login',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/login.vue') : import('@packages/moii-auth/src/views/boxed/login.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/register',
        name: 'register',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/register.vue') : import('@packages/moii-auth/src/views/boxed/register.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/lockscreen',
        name: 'lockscreen',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/lockscreen.vue') : import('@packages/moii-auth/src/views/boxed/lockscreen.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/password-reset',
        name: 'password-reset',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/password-reset.vue') : import('@packages/moii-auth/src/views/boxed/password-reset.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/password-confirm',
        name: 'password-confirm',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/password-confirm.vue') : import('@packages/moii-auth/src/views/boxed/password-confirm.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/2fa',
        name: '2fa',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/2fa.vue') : import('@packages/moii-auth/src/views/boxed/2fa.vue');
        },
        meta: { layout: 'auth' },
    },
    {
        path: '/temporary-login',
        name: 'temporary-login',
        component: () => {
            const layout = getLayout();
            return layout === 'full' ? import('@packages/moii-auth/src/views/cover/temporary-login.vue') : import('@packages/moii-auth/src/views/boxed/temporary-login.vue');
        },
        meta: { layout: 'auth' },
    },
];
