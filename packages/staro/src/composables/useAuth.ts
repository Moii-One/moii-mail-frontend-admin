import { useAuthStore } from '../../../moii-auth/src/stores/auth';

/**
 * Check if the current route requires authentication for this package
 * @param to - The target route
 * @returns boolean
 */
export function requiresAuth(to: any): boolean {
    // Package-specific public routes that don't require auth
    const packagePublicRoutes: string[] = [
        // Add any public notification routes here if needed
    ];

    // Check if route is in this package's public routes
    if (packagePublicRoutes.includes(to.path)) {
        return false;
    }

    // Check if route has meta.requiresAuth explicitly set to false
    if (to.meta?.requiresAuth === false) {
        return false;
    }

    // Check if route has meta.requiresAuth explicitly set to true
    if (to.meta?.requiresAuth === true) {
        return true;
    }

    // For notifications package routes, check if path starts with /notifications
    if (to.path.startsWith('/notifications')) {
        return true;
    }

    // Default to requiring auth for this package
    return true;
}

/**
 * Check if user has required permissions for a route
 * @param to - The target route
 * @returns boolean
 */
export function hasPermissions(to: any): boolean {
    const authStore = useAuthStore();
    
    // If no permissions specified in route meta, allow access
    if (!to.meta?.permissions || !Array.isArray(to.meta.permissions)) {
        return true;
    }

    // Check if user has any of the required permissions
    const requiredPermissions = to.meta.permissions;
    
    // For now, we'll assume all authenticated users have access
    // In a real app, you'd check against the user's actual permissions
    return authStore.isAuthenticated;
}
