import { useAuthStore } from '../../../moii-auth/src/stores/auth';

/**
 * Check if the current route requires authentication
 * @param to - The target route
 * @returns boolean
 */
export function requiresAuth(to: any): boolean {
    // Routes that should be accessible without authentication
    const publicRoutes = [
        '/login',
        '/register',
        '/password-reset',
        '/password-confirm',
        '/2fa',
        '/temporary-login',
        '/lockscreen',
        '/pages/contact-us-boxed',
        '/pages/contact-us-cover',
        '/pages/coming-soon-boxed',
        '/pages/coming-soon-cover',
        '/pages/error404',
        '/pages/error500',
        '/pages/error503',
        '/pages/maintenence'
    ];

    // Check if route is public
    if (publicRoutes.includes(to.path)) {
        return false;
    }

    // Check if route has meta.requiresAuth explicitly set to false
    if (to.meta?.requiresAuth === false) {
        return false;
    }

    // Check if route has auth layout (these are typically public)
    if (to.meta?.layout === 'auth') {
        return false;
    }

    // All other routes require authentication by default
    return true;
}

/**
 * Check if user is authenticated
 * @returns boolean
 */
export function isAuthenticated(): boolean {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
}

/**
 * Get the redirect path for unauthenticated users
 * @param to - The target route they were trying to access
 * @returns string
 */
export function getLoginRedirect(to: any): string {
    // Store the intended destination for redirect after login
    const redirectPath = to.path !== '/login' ? to.fullPath : '/';
    return `/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`;
}

/**
 * Handle redirect after successful login
 * @param router - Vue router instance
 * @param route - Current route
 */
export function handleLoginRedirect(router: any, route: any) {
    const redirectPath = route.query.redirect as string;
    if (redirectPath && redirectPath !== '/login') {
        router.push(decodeURIComponent(redirectPath));
    } else {
        router.push('/');
    }
}
