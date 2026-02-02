<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">Monitor email delivery status and track sent messages</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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
                                placeholder="Search by email, subject..."
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
                            :model-value="modelValue.status || ''"
                            :options="statusOptions"
                            placeholder="All Statuses"
                            :searchable="false"
                            :allowEmpty="true"
                            @update:model-value="updateFilter('status', $event)"
                        />
                    </div>

                    <!-- Date From -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Date From</label>
                        <input
                            type="date"
                            class="form-input"
                            :value="modelValue.date_from"
                            @input="updateFilter('date_from', ($event.target as HTMLInputElement).value)"
                        />
                    </div>

                    <!-- Date To -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Date To</label>
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
import CustomSelect from './CustomSelect.vue';
import IconCaretDown from '../../../../src/components/icon/icon-caret-down.vue';
import IconSearch from '../../../../src/components/icon/icon-search.vue';
import IconRefresh from '../../../../src/components/icon/icon-refresh.vue';

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

const showFilters = ref(false);

// Status options
const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Sent', value: 'sent' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Failed', value: 'failed' },
    { label: 'Bounced', value: 'bounced' }
];

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
