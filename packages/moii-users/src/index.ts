// Stores
export { useUsersStore } from './stores/users';
export { useSessionsStore } from './stores/sessions';
export type {
    User,
    Role,
    Permission,
    UserSession,
    CreateUserData,
    UpdateUserData,
    UsersResponse,
    UserSessionsResponse,
    TwoFactorStatus,
    TwoFactorStatusResponse
} from './stores/users';
export type {
    SessionsResponse
} from './stores/sessions';

// Composables
export { requiresAuth } from './composables/useAuth';

// Router
export { default as userRoutes } from './router';

// Components
export { default as UsersList } from './views/UsersList.vue';
export { default as SessionsList } from './views/SessionsList.vue';
export { default as UsersHeader } from './components/UsersHeader.vue';
export { default as UserModal } from './components/UserModal.vue';
export { default as SessionItem } from './components/SessionItem.vue';

// Icons
export { default as IconUsers } from './components/icon/icon-users.vue';
export { default as IconPause } from './components/icon/icon-pause.vue';
export { default as IconLock } from './components/icon/icon-lock.vue';
export { default as IconEye } from './components/icon/icon-eye.vue';
export { default as IconEdit } from './components/icon/icon-edit.vue';
export { default as IconPlus } from './components/icon/icon-plus.vue';
export { default as IconDotsVertical } from './components/icon/icon-dots-vertical.vue';
export { default as IconPlay } from './components/icon/icon-play.vue';
export { default as IconUnlock } from './components/icon/icon-unlock.vue';
export { default as IconRefresh } from './components/icon/icon-refresh.vue';
export { default as IconShield } from './components/icon/icon-shield.vue';
export { default as IconLogout } from './components/icon/icon-logout.vue';
export { default as IconTrash } from './components/icon/icon-trash.vue';
export { default as IconMonitor } from './components/icon/icon-monitor.vue';
export { default as IconGlobe } from './components/icon/icon-globe.vue';
export { default as IconClock } from './components/icon/icon-clock.vue';
