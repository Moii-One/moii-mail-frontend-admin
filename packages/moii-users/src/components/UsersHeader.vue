<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">Manage users, accounts, and permissions</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                    v-if="hasPermission('users.create')"
                    type="button"
                    class="btn btn-primary"
                    @click="$emit('create-user')"
                >
                    <icon-plus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create User
                </button>
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="showFilters = !showFilters"
                >
                    <icon-menu class="ltr:mr-2 rtl:ml-2" />
                    Filters
                    <icon-caret-down class="ltr:ml-2 rtl:mr-2" :class="{ 'rotate-180': showFilters }" />
                </button>
            </div>
        </div>

        <!-- Filters Accordion -->
        <vue-collapsible :isOpen="showFilters">
            <div class="panel p-4 space-y-4 mb-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Search</label>
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                :value="modelValue.search"
                                @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <icon-search class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Status</label>
                        <CustomSelect
                            :model-value="modelValue.status"
                            :options="statusOptions"
                            placeholder="All Status"
                            @update:model-value="updateFilter('status', $event)"
                        />
                    </div>

                    <!-- Tenant Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Tenant</label>
                        <CustomSelect
                            :model-value="modelValue.tenant"
                            :options="tenantOptions"
                            placeholder="All Tenants"
                            @update:model-value="updateFilter('tenant', $event)"
                        />
                    </div>

                    <!-- App Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">App</label>
                        <CustomSelect
                            :model-value="modelValue.app"
                            :options="appOptions"
                            placeholder="All Apps"
                            @update:model-value="updateFilter('app', $event)"
                        />
                    </div>

                    <!-- Company Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Company</label>
                        <CustomSelect
                            :model-value="modelValue.company"
                            :options="companyOptions"
                            placeholder="All Companies"
                            @update:model-value="updateFilter('company', $event)"
                        />
                    </div>

                    <!-- Locked Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Account Status</label>
                        <CustomSelect
                            :model-value="modelValue.locked"
                            :options="lockedOptions"
                            placeholder="All Accounts"
                            @update:model-value="updateFilter('locked', $event)"
                        />
                    </div>
                </div>

                <!-- Clear Filters -->
                <div class="flex items-center justify-end">
                    <button 
                        type="button" 
                        class="btn btn-outline-warning whitespace-nowrap"
                        @click="clearFilters"
                    >
                        <icon-refresh class="ltr:mr-2 rtl:ml-2" />
                        Clear Filters
                    </button>
                </div>
            </div>
        </vue-collapsible>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import { useUsersStore } from '../stores/users';
import { useTenantsStore } from '../../../moii-tenants/src/stores/tenants';
import { useAppsStore } from '../../../moii-apps/src/stores/apps';
import { usePermissions } from '../composables/usePermissions';
import CustomSelect from './CustomSelect.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import IconMenu from '../components/icon/icon-menu.vue';
import IconCaretDown from '../components/icon/icon-caret-down.vue';
import IconSearch from '../components/icon/icon-search.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';

export interface UserFilterModel {
    search: string;
    status: string;
    tenant: string;
    app: string;
    company: string;
    locked: string;
}

interface Props {
    title: string;
    modelValue: UserFilterModel;
}

interface Emits {
    (e: 'update:modelValue', value: UserFilterModel): void;
    (e: 'create-user'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const usersStore = useUsersStore();
const tenantsStore = useTenantsStore();
const appsStore = useAppsStore();
const { hasPermission } = usePermissions();
const showFilters = ref(false);

// Load tenants and apps on mount
onMounted(async () => {
    await tenantsStore.fetchTenants();
    await appsStore.fetchApps();
});

const updateFilter = (key: keyof UserFilterModel, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    });
};

const clearFilters = () => {
    emit('update:modelValue', {
        search: '',
        status: '',
        tenant: '',
        app: '',
        company: '',
        locked: ''
    });
};

// Select options
const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
];

const lockedOptions = [
    { value: '', label: 'All Accounts' },
    { value: 'false', label: 'Unlocked' },
    { value: 'true', label: 'Locked' }
];

// Tenant options
const tenantOptions = computed(() => [
    { value: '', label: 'All Tenants' },
    ...tenantsStore.tenants.map(tenant => ({
        value: tenant.id?.toString() || '',
        label: tenant.name
    }))
]);

// App options
const appOptions = computed(() => [
    { value: '', label: 'All Apps' },
    ...appsStore.apps.map(app => ({
        value: app.id?.toString() || '',
        label: app.name
    }))
]);

// Get unique companies from users
const availableCompanies = computed(() => {
    const companies = new Set(
        usersStore.users
            .map(user => user.company)
            .filter(company => company && company.trim() !== '')
    );
    return Array.from(companies).sort();
});

const companyOptions = computed(() => [
    { value: '', label: 'All Companies' },
    ...availableCompanies.value.map(company => ({
        value: company,
        label: company
    }))
]);
</script>

<style scoped>
/* Force multiselect dropdowns to be visible above everything */
:deep(.multiselect__content-wrapper) {
    position: absolute !important;
    z-index: 99999 !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    background: white !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 6px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    width: 100% !important;
    min-width: 200px !important;
    top: 100% !important;
    left: 0 !important;
    display: none !important; /* Hide by default */
}

/* Force the multiselect container to allow overflow */
:deep(.multiselect) {
    position: relative !important;
    z-index: 1000 !important;
}

/* Show dropdown only when multiselect is active */
:deep(.multiselect--active .multiselect__content-wrapper) {
    display: block !important;
    position: absolute !important;
    visibility: visible !important;
}

/* Aggressive overflow control for all parent containers */
:deep(.multiselect--active),
:deep([data-height-collapsible] .multiselect--active),
:deep([data-height-collapsible] .panel .multiselect--active),
:deep(.space-y-4 [data-height-collapsible] .multiselect--active) {
    overflow: visible !important;
}

/* Ensure the entire collapsible allows overflow when any multiselect is active */
:deep([data-height-collapsible]:has(.multiselect--active)) {
    overflow: visible !important;
}

:deep([data-height-collapsible] .panel:has(.multiselect--active)) {
    overflow: visible !important;
}
</style>
