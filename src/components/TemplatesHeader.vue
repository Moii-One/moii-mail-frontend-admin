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
import { IconMenu,  IconCaretDown, IconPlus, IconRefresh, IconSearch, CustomSelect } from '../../../moii-ui/src/index';
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
.rotate-180 {
    transform: rotate(180deg);
}
</style>
