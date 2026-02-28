<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">{{ t('mail.logs.subtitle') }}</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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
                                :placeholder="t('mail.filters.search_logs')"
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

                    <!-- Date From -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.date_from') }}</label>
                        <input
                            type="date"
                            class="form-input"
                            :value="modelValue.date_from"
                            @input="updateFilter('date_from', ($event.target as HTMLInputElement).value)"
                        />
                    </div>

                    <!-- Date To -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">{{ t('mail.filters.date_to') }}</label>
                        <input
                            type="date"
                            class="form-input"
                            :value="modelValue.date_to"
                            @input="updateFilter('date_to', ($event.target as HTMLInputElement).value)"
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
import { useI18n } from '../../../moii-localizations/src/composables/useI18n';
import { IconMenu,  IconCaretDown, IconRefresh, IconSearch, CustomSelect } from '../../../moii-ui/src/index';
export interface MailLogsFilterModel {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    title: string;
    modelValue: MailLogsFilterModel;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Mail Logs'
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: MailLogsFilterModel): void;
}>();

const { t } = useI18n();
const showFilters = ref(false);

// Status options
const statusOptions = computed(() => [
    { label: t('mail.filters.all_statuses'), value: '' },
    { label: t('mail.status.pending'), value: 'pending' },
    { label: t('mail.status.sent'), value: 'sent' },
    { label: t('mail.status.delivered'), value: 'delivered' },
    { label: t('mail.status.failed'), value: 'failed' },
    { label: t('mail.status.bounced'), value: 'bounced' }
]);

const updateFilter = (key: keyof MailLogsFilterModel, value: string) => {
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
