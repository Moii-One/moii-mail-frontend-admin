import { computed } from 'vue';
import { useAuthStore } from '../../packages/moii-auth/src/stores/auth';

export function usePermissions() {
    const authStore = useAuthStore();

    const userPermissions = computed(() => authStore.user?.permissions || []);
    const userRoles = computed(() => authStore.user?.roles || []);

    const isSuperAdmin = computed(() => {
        return userRoles.value.some(role => role.slug === 'super-admin');
    });

    const isAdmin = computed(() => {
        return userRoles.value.some(role => ['super-admin', 'admin'].includes(role.slug));
    });

    const hasPermission = (permissionKey: string): boolean => {
        // Super Admin has all permissions
        if (isSuperAdmin.value) {
            return true;
        }

        return userPermissions.value.some(permission => permission.key === permissionKey);
    };

    const hasAnyPermission = (permissionKeys: string[]): boolean => {
        // Super Admin has all permissions
        if (isSuperAdmin.value) {
            return true;
        }

        return permissionKeys.some(key => hasPermission(key));
    };

    const hasAllPermissions = (permissionKeys: string[]): boolean => {
        // Super Admin has all permissions
        if (isSuperAdmin.value) {
            return true;
        }

        return permissionKeys.every(key => hasPermission(key));
    };

    const hasRole = (roleSlug: string): boolean => {
        return userRoles.value.some(role => role.slug === roleSlug);
    };

    const hasAnyRole = (roleSlugs: string[]): boolean => {
        return roleSlugs.some(slug => hasRole(slug));
    };

    const hasAllRoles = (roleSlugs: string[]): boolean => {
        return roleSlugs.every(slug => hasRole(slug));
    };

    const loadUserPermissions = async (): Promise<void> => {
        // Permissions are already loaded with user data from auth store
        // This method exists for API consistency with package-level composables
        return Promise.resolve();
    };

    return {
        userPermissions,
        userRoles,
        isSuperAdmin,
        isAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        loadUserPermissions
    };
}
