import { useAuthStore } from '../../../moii-auth/src/stores/auth';

/**
 * Check if the current route requires authentication for this package
 * @param to - The target route
 * @returns boolean
 */
export function requiresAuth(to: any): boolean {
    // Package-specific public routes that don't require auth
    const packagePublicRoutes: string[] = [
        // Add any public reviews routes here if needed
    ];

    // Check if route is in this package's public routes
    if (packagePublicRoutes.includes(to.path)) {
        return false;
    }

    // Check if route has meta.requiresAuth explicitly set to false
    if (to.meta?.requiresAuth === false) {
        return false;
    }

    // All other routes in this package require authentication by default
    if (to.path.startsWith('/reviews')) {
        return true;
    }

    // For routes not in this package, return false (defer to main auth logic)
    return false;
}

/**
 * Check if user is authenticated (delegates to main auth store)
 * @returns boolean
 */
export function isAuthenticated(): boolean {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
}

/**
 * Get package-specific login redirect path
 * @param to - The target route they were trying to access
 * @returns string
 */
export function getLoginRedirect(to: any): string {
    // Store the intended destination for redirect after login
    const redirectPath = to.path !== '/login' ? to.fullPath : '/reviews';
    return `/login${redirectPath !== '/reviews' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`;
}
