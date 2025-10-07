<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
            <h2 class="text-xl">{{ title }}</h2>
            <div class="flex gap-3">
                <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="$emit('add')"
                    :disabled="!selectedLanguage"
                >
                    <icon-plus class="ltr:mr-2 rtl:ml-2" />
                    Add Translation
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
                                placeholder="Search by key or value..."
                                class="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                                :value="searchQuery"
                                @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                            />
                            <div class="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <icon-search class="mx-auto" />
                            </div>
                        </div>
                    </div>

                    <!-- Language Filter -->
                    <div>
                        <label class="text-sm font-semibold mb-2 block">Language</label>
                        <select 
                            class="form-select text-white-dark"
                            :value="selectedLanguage"
                            @change="$emit('update:selectedLanguage', ($event.target as HTMLSelectElement).value)"
                        >
                            <option value="">Select Language</option>
                            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                                {{ lang.name }} ({{ lang.code }})
                            </option>
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

interface Language {
    code: string;
    name: string;
}

const props = defineProps<{
    title: string;
    selectedLanguage: string;
    searchQuery: string;
    availableLanguages: Language[];
}>();

const emit = defineEmits<{
    (e: 'update:selectedLanguage', value: string): void;
    (e: 'update:searchQuery', value: string): void;
    (e: 'add'): void;
}>();

const showFilters = ref(false);

const clearFilters = () => {
    emit('update:selectedLanguage', '');
    emit('update:searchQuery', '');
};
</script>
