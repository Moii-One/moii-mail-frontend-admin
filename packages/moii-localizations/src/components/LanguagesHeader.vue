<template>
    <div class="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 class="text-xl">{{ title }}</h2>
        <div class="flex gap-3">
            <button type="button" class="btn btn-primary" @click="$emit('add')">
                <icon-plus class="ltr:mr-2 rtl:ml-2" />
                Add Language
            </button>
            <select 
                v-if="availableLanguages.length > 0"
                class="form-select w-auto"
                :value="selectedLanguage"
                @change="$emit('update:selectedLanguage', ($event.target as HTMLSelectElement).value)"
            >
                <option value="">All Languages</option>
                <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                    {{ lang.name }} ({{ lang.code }})
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import IconPlus from '@/components/icon/icon-plus.vue';

interface Language {
    code: string;
    name: string;
}

const props = defineProps<{
    title: string;
    selectedLanguage: string;
    availableLanguages: Language[];
}>();

const emit = defineEmits<{
    (e: 'update:selectedLanguage', value: string): void;
    (e: 'add'): void;
}>();
</script>
