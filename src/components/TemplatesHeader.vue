<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">Manage email templates used across the platform</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <router-link
                    v-if="canCreate"
                    to="/mail/templates/create"
                    class="btn btn-primary"
                >
                    <icon-plus class="ltr:mr-2 rtl:ml-2" />
                    Create Template
                </router-link>
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="showFilters = !showFilters"
                >
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
                                placeholder="Search templates..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                :value="modelValue.search"
                                @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <icon-search class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Package Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Package</label>
                        <CustomSelect
                            :model-value="modelValue.package || ''"
                            :options="packageOptions"
                            placeholder="All Packages"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('package', $event)"
                        />
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Status</label>
                        <CustomSelect
                            :model-value="modelValue.status || ''"
                            :options="statusOptions"
                            placeholder="All Status"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('status', $event)"
                        />
                    </div>

                    <!-- Tag Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Tag</label>
                        <CustomSelect
                            :model-value="modelValue.tag || ''"
                            :options="tagOptions"
                            placeholder="All Tags"
                            :searchable="true"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('tag', $event)"
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
import { ref } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import { usePermissions } from '../../../../src/composables/usePermissions';
import CustomSelect from './CustomSelect.vue';
import IconCaretDown from '../../../../src/components/icon/icon-caret-down.vue';
import IconSearch from '../../../../src/components/icon/icon-search.vue';
import IconRefresh from '../../../../src/components/icon/icon-refresh.vue';
import IconPlus from '../../../../src/components/icon/icon-plus.vue';

export interface TemplatesFilterModel {
    package?: string;
    status?: string;
    tag?: string;
    search?: string;
}

interface Props {
    title: string;
    modelValue: TemplatesFilterModel;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Email Templates'
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: TemplatesFilterModel): void;
}>();

const { hasPermission } = usePermissions();
const canCreate = hasPermission('mail.templates.create');

const showFilters = ref(false);

// Package options
const packageOptions = [
    { label: 'All Packages', value: '' },
    { label: 'Auth', value: 'auth' },
    { label: 'Notification', value: 'notification' },
    { label: 'System', value: 'system' }
];

// Status options
const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
];

// Tag options
const tagOptions = [
    { label: 'All Tags', value: '' },
    { label: '2FA', value: '2fa' },
    { label: 'Password', value: 'password' },
    { label: 'Registration', value: 'registration' },
    { label: 'Welcome', value: 'welcome' },
    { label: 'Reset', value: 'reset' },
    { label: 'Security', value: 'security' },
    { label: 'Login', value: 'login' },
    { label: 'Temporary', value: 'temporary' }
];

const updateFilter = (key: keyof TemplatesFilterModel, value: string) => {
    const newValue = value === '' ? undefined : value;
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: newValue
    });
};

const clearFilters = () => {
    emit('update:modelValue', {});
};
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

.rotate-180 {
    transform: rotate(180deg);
}
</style>
