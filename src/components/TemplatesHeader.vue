<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">{{ t('mail.templates.subtitle') }}</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <router-link
                    v-if="canCreate"
                    to="/mail/templates/create"
                    class="btn btn-primary"
                >
                    <icon-plus class="ltr:mr-2 rtl:ml-2" />
                    {{ t('mail.templates.create') }}
                </router-link>
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="showFilters = !showFilters"
                >
                    <icon-menu class="ltr:mr-2 rtl:ml-2" />
                    {{ t('mail.filters.filters') }}
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
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.search') }}</label>
                        <div class="relative">
                            <input
                                type="text"
                                :placeholder="t('mail.filters.search_templates')"
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
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.package') }}</label>
                        <CustomSelect
                            :model-value="modelValue.package || ''"
                            :options="packageOptions"
                            :placeholder="t('mail.filters.all_packages')"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('package', $event)"
                        />
                    </div>

                    <!-- Status Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.status') }}</label>
                        <CustomSelect
                            :model-value="modelValue.status || ''"
                            :options="statusOptions"
                            :placeholder="t('mail.filters.all_statuses')"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('status', $event)"
                        />
                    </div>

                    <!-- Tag Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.tag') }}</label>
                        <CustomSelect
                            :model-value="modelValue.tag || ''"
                            :options="tagOptions"
                            :placeholder="t('mail.filters.all_tags')"
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
                        {{ t('mail.filters.clear_filters') }}
                    </button>
                </div>
            </div>
        </vue-collapsible>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import { usePermissions } from '../../../../src/composables/usePermissions';
import { useI18n } from '../../../moii-localizations/src/composables/useI18n';
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
const { t } = useI18n();
const canCreate = hasPermission('mail.templates.create');

const showFilters = ref(false);

// Package options
const packageOptions = computed(() => [
    { label: t('mail.filters.all_packages'), value: '' },
    { label: t('mail.packages.auth'), value: 'auth' },
    { label: t('mail.packages.notification'), value: 'notification' },
    { label: t('mail.packages.system'), value: 'system' }
]);

// Status options
const statusOptions = computed(() => [
    { label: t('mail.filters.all_statuses'), value: '' },
    { label: t('mail.status.active'), value: 'active' },
    { label: t('mail.status.inactive'), value: 'inactive' }
]);

// Tag options
const tagOptions = computed(() => [
    { label: t('mail.filters.all_tags'), value: '' },
    { label: t('mail.tags.2fa'), value: '2fa' },
    { label: t('mail.tags.password'), value: 'password' },
    { label: t('mail.tags.registration'), value: 'registration' },
    { label: t('mail.tags.welcome'), value: 'welcome' },
    { label: t('mail.tags.reset'), value: 'reset' },
    { label: t('mail.tags.security'), value: 'security' },
    { label: t('mail.tags.login'), value: 'login' },
    { label: t('mail.tags.temporary'), value: 'temporary' }
]);

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
