<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">Manage users, accounts, and permissions</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
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
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        class="btn btn-outline-warning"
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
import { computed, ref } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import { useUsersStore } from '../stores/users';
import CustomSelect from './CustomSelect.vue';
import IconPlus from '../components/icon/icon-plus.vue';
import IconMenu from '../components/icon/icon-menu.vue';
import IconCaretDown from '../components/icon/icon-caret-down.vue';
import IconSearch from '../components/icon/icon-search.vue';
import IconRefresh from '../components/icon/icon-refresh.vue';

export interface UserFilterModel {
    search: string;
    status: string;
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
const showFilters = ref(false);

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
/* Ensure custom select dropdowns are visible */
:deep(.custom-multiselect-wrapper) {
    z-index: 2;
}

:deep(.custom-multiselect-wrapper .multiselect) {
    z-index: 2;
}

:deep(.custom-multiselect-wrapper .multiselect__content-wrapper) {
    z-index: 1000 !important;
}

:deep(.multiselect__content) {
    z-index: 1000 !important;
}

/* Force all parent containers to allow overflow when multiselect is active */
:deep(.panel:has(.multiselect--active)),
:deep(.space-y-4:has(.multiselect--active)),
:deep([data-height-collapsible]:has(.multiselect--active)) {
    overflow: visible !important;
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
