<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
            <h2 class="text-xl">{{ title }}</h2>
            <div class="flex gap-3">
                <button type="button" class="btn btn-primary" @click="$emit('add')">
                    <icon-plus class="ltr:mr-2 rtl:ml-2" />
                    Add Setting
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
            <div class="panel p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Search</label>
                        <div class="relative">
                            <input
                                type="text"
                                placeholder="Search by key, group, or description..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                :value="modelValue.search"
                                @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <icon-search class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Type Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Type</label>
                        <select 
                            class="form-select text-white-dark"
                            :value="modelValue.type"
                            @change="updateFilter('type', ($event.target as HTMLSelectElement).value)"
                        >
                            <option value="">All Types</option>
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="json">JSON</option>
                            <option value="array">Array</option>
                        </select>
                    </div>

                    <!-- Group Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Group</label>
                        <select 
                            class="form-select text-white-dark"
                            :value="modelValue.group"
                            @change="updateFilter('group', ($event.target as HTMLSelectElement).value)"
                        >
                            <option value="">All Groups</option>
                            <option v-for="group in availableGroups" :key="group" :value="group">
                                {{ group }}
                            </option>
                        </select>
                    </div>

                    <!-- Visibility Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Visibility</label>
                        <select 
                            class="form-select text-white-dark"
                            :value="modelValue.visibility"
                            @change="updateFilter('visibility', ($event.target as HTMLSelectElement).value)"
                        >
                            <option value="">All</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <!-- Clear Filters Button -->
                    <div class="flex items-end">
                        <button 
                            type="button" 
                            class="btn btn-outline-danger w-full"
                            @click="clearFilters"
                        >
                            <icon-refresh class="ltr:mr-2 rtl:ml-2" />
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </vue-collapsible>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueCollapsible from 'vue-height-collapsible/vue3';
import IconPlus from '@/components/icon/icon-plus.vue';
import IconSearch from '@/components/icon/icon-search.vue';
import IconMenu from '@/components/icon/icon-menu.vue';
import IconCaretDown from '@/components/icon/icon-caret-down.vue';
import IconRefresh from '@/components/icon/icon-refresh.vue';

export interface FilterModel {
    search: string;
    type: string;
    group: string;
    visibility: string;
}

const props = defineProps<{
    title: string;
    modelValue: FilterModel;
    availableGroups: string[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: FilterModel): void;
    (e: 'add'): void;
}>();

const showFilters = ref(false);

const updateFilter = (key: keyof FilterModel, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    });
};

const clearFilters = () => {
    emit('update:modelValue', {
        search: '',
        type: '',
        group: '',
        visibility: ''
    });
};
</script>
