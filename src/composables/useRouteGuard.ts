import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { usePermissions } from './usePermissions';

/**
 * Route guard to check if user has permission to access a route
 * @param to - The target Route Location being navigated to
 * @param from - The current route location being navigated away from
 * @param next - Function to resolve the guard
 * @param permissionKey - The permission key required to access the route
 */
export function requiresPermission(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    permissionKey: string
) {
    const { hasPermission } = usePermissions();

    if (hasPermission(permissionKey)) {
        next();
    } else {
        // Redirect to dashboard if user doesn't have permission
        next({ name: 'home' });
    }
}

/**
 * Higher-order function to create a route guard with a specific permission
 * @param permissionKey - The permission key required
 * @returns Navigation guard function
 */
export function createPermissionGuard(permissionKey: string) {
    return (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        requiresPermission(to, from, next, permissionKey);
    };
}

/**
 * Route guard to check if user has any of the specified permissions
 * @param to - The target Route Location
 * @param from - The current route location
 * @param next - Function to resolve the guard
 * @param permissionKeys - Array of permission keys (user needs at least one)
 */
export function requiresAnyPermission(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    permissionKeys: string[]
) {
    const { hasAnyPermission } = usePermissions();

    if (hasAnyPermission(permissionKeys)) {
        next();
    } else {
        next({ name: 'home' });
    }
}

/**
 * Higher-order function to create a route guard that checks for any of the permissions
 * @param permissionKeys - Array of permission keys
 * @returns Navigation guard function
 */
export function createAnyPermissionGuard(permissionKeys: string[]) {
    return (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        requiresAnyPermission(to, from, next, permissionKeys);
    };
}
