<template>
    <div class="space-y-4">
        <div class="panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h5 class="font-semibold text-lg dark:text-white-light">{{ title }}</h5>
                <p class="text-white-dark text-sm mt-1">View and manage system permissions</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="$emit('create-permission')"
                >
                    <icon-plus class="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Create Permission
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
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Search</label>
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Search permissions..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                :value="modelValue.searchTerm"
                                @input="updateFilter('searchTerm', ($event.target as HTMLInputElement).value)"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <icon-search class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Category Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Category</label>
                        <CustomSelect
                            :model-value="modelValue.filterCategory"
                            :options="categoryOptions"
                            placeholder="All Categories"
                            @update:model-value="updateFilter('filterCategory', $event)"
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
import { ref, computed } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import CustomSelect from './CustomSelect.vue';
import IconPlus from './icon/icon-plus.vue';
import IconMenu from './icon/icon-menu.vue';
import IconCaretDown from './icon/icon-caret-down.vue';
import IconRefresh from './icon/icon-refresh.vue';
import IconSearch from './icon/icon-search.vue';

interface Props {
    title: string;
    modelValue: {
        searchTerm: string;
        filterCategory: string;
    };
    uniqueCategories: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void;
    (e: 'create-permission'): void;
}>();

const showFilters = ref(false);

const categoryOptions = computed(() => [
    { value: '', label: 'All Categories' },
    ...props.uniqueCategories.map(category => ({
        value: category,
        label: category
    }))
]);

const updateFilter = (key: keyof Props['modelValue'], value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    });
};

const clearFilters = () => {
    emit('update:modelValue', {
        searchTerm: '',
        filterCategory: ''
    });
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
</style>
