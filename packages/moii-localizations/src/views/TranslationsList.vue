<template>
    <div>
        <TranslationsHeader
            title="Translation Strings"
            v-model:selectedLanguage="selectedLanguage"
            v-model:searchQuery="searchQuery"
            :availableLanguages="languagesStore.activeLanguages"
            @add="editTranslation()"
        />

        <!-- Translations Statistics -->
        <div v-if="selectedLanguage" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-menu-components class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ totalTranslations }}</h3>
                        <p class="text-white-dark text-sm">Total Translations</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-square-check class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ translatedCount }}</h3>
                        <p class="text-white-dark text-sm">Translated</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-info-triangle class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ emptyCount }}</h3>
                        <p class="text-white-dark text-sm">Empty Translations</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedLanguage" class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="filteredTranslations"
                    :columns="cols"
                    :totalRows="filteredTranslations?.length"
                    :search="searchQuery"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #key="data">
                        <div class="font-semibold">{{ data.value.key }}</div>
                    </template>
                    <template #value="data">
                        <div class="max-w-md truncate" :title="data.value.value">
                            {{ data.value.value }}
                        </div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button type="button" class="btn btn-sm btn-outline-info" @click="duplicateTranslation(data.value)">
                                <icon-copy class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="editTranslation(data.value)">
                                <icon-edit class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteTranslation(data.value)">
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <div v-else class="mt-5 panel">
            <div class="text-center py-8 text-white-dark">
                Please select a language to view and manage translations
            </div>
        </div>

        <!-- Add/Edit Translation Modal -->
        <TranslationModal
            :show="addTranslationModal"
            :translation="currentTranslation"
            :language-code="selectedLanguage"
            :initial-data="initialTranslationData"
            @close="closeTranslationModal"
            @save="saveTranslation"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { useLanguagesStore } from '../stores/languages';
import { useTranslationsStore } from '../stores/translations';
import { useToast } from '../composables/useToast';
import TranslationsHeader from '../components/TranslationsHeader.vue';
import TranslationModal from '../components/TranslationModal.vue';
import IconMenuComponents from '../components/icon/menu/icon-menu-components.vue';
import IconSquareCheck from '../components/icon/icon-square-check.vue';
import IconInfoTriangle from '../components/icon/icon-info-triangle.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconCopy from '../components/icon/icon-copy.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();

const selectedLanguage = ref('');
const searchQuery = ref('');
const addTranslationModal = ref(false);
const currentTranslation = ref<{ key: string; value: string } | null>(null);
const initialTranslationData = ref<Partial<{ key: string; value: string }> | null>(null);

const cols = ref([
    { field: 'key', title: 'Key' },
    { field: 'value', title: 'Value' },
    { field: 'actions', title: 'Actions', isUnique: true },
]);

const filteredTranslations = computed(() => {
    const trans = translationsStore.translations;
    
    // Flatten nested objects into key-value pairs
    const flattenObject = (obj: any, prefix = ''): Array<{ key: string; value: string }> => {
        const items: Array<{ key: string; value: string }> = [];
        
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively flatten nested objects
                items.push(...flattenObject(value, fullKey));
            } else {
                // Add leaf values
                items.push({ 
                    key: fullKey, 
                    value: String(value) 
                });
            }
        }
        
        return items;
    };
    
    const items = flattenObject(trans);
    
    if (!searchQuery.value) {
        return items;
    }
    
    const query = searchQuery.value.toLowerCase();
    return items.filter(item => 
        item.key.toLowerCase().includes(query) || 
        item.value.toLowerCase().includes(query)
    );
});

// Statistics computed properties
const totalTranslations = computed(() => {
    return filteredTranslations.value.length;
});

const translatedCount = computed(() => {
    return filteredTranslations.value.filter(item => 
        item.value && item.value.trim() !== ''
    ).length;
});

const emptyCount = computed(() => {
    return filteredTranslations.value.filter(item => 
        !item.value || item.value.trim() === ''
    ).length;
});

onMounted(async () => {
    try {
        await languagesStore.fetchLanguages();
        
        // Use nextTick to ensure the store is fully updated
        await new Promise(resolve => setTimeout(resolve, 0));
        
        if (languagesStore.activeLanguages.length > 0) {
            // Preselect the default language if available, otherwise use the first active language
            const defaultLang = languagesStore.defaultLanguage;
            
            if (defaultLang && defaultLang.is_active) {
                selectedLanguage.value = defaultLang.code;
            } else {
                selectedLanguage.value = languagesStore.activeLanguages[0].code;
            }
            
            // Ensure we load translations after language selection
            if (selectedLanguage.value) {
                await loadTranslations();
            }
        }
    } catch (error) {
        console.error('Error in onMounted:', error);
        showMessage('Failed to load languages.', 'error');
    }
});

// Watch for language changes
watch(selectedLanguage, async (newVal) => {
    if (newVal) {
        await loadTranslations();
    }
});

// Watch for languages store changes to ensure we select a language when they become available
watch(() => languagesStore.activeLanguages, (newLanguages) => {
    if (newLanguages.length > 0 && !selectedLanguage.value) {
        const defaultLang = languagesStore.defaultLanguage;
        if (defaultLang && defaultLang.is_active) {
            selectedLanguage.value = defaultLang.code;
        } else {
            selectedLanguage.value = newLanguages[0].code;
        }
    }
}, { immediate: true });

const loadTranslations = async () => {
    if (selectedLanguage.value) {
        try {
            await translationsStore.fetchTranslations(selectedLanguage.value);
        } catch (err) {
            showMessage('Failed to load translations.', 'error');
        }
    }
};

const editTranslation = (translation: { key: string; value: string } | null = null) => {
    currentTranslation.value = translation;
    initialTranslationData.value = null;
    addTranslationModal.value = true;
};

const saveTranslation = async (formData: { key: string; value: string }) => {
    if (!formData.key) {
        showMessage('Translation key is required.', 'error');
        return;
    }
    if (!formData.value) {
        showMessage('Translation value is required.', 'error');
        return;
    }

    try {
        await translationsStore.setTranslation(selectedLanguage.value, formData.key, formData.value);
        showMessage('Translation has been saved successfully.');
        addTranslationModal.value = false;
        currentTranslation.value = null;
        initialTranslationData.value = null;
    } catch (err) {
        showMessage('Failed to save translation.', 'error');
    }
};

const deleteTranslation = async (translation: { key: string; value: string }) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `You are about to delete the translation key "${translation.key}". This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });

    if (result.isConfirmed) {
        try {
            await translationsStore.deleteTranslation(selectedLanguage.value, translation.key);
            showMessage('Translation has been deleted successfully.');
        } catch (err) {
            showMessage('Failed to delete translation.', 'error');
        }
    }
};

const duplicateTranslation = (translation: { key: string; value: string }) => {
    currentTranslation.value = null;
    initialTranslationData.value = {
        key: `${translation.key}_copy`,
        value: translation.value,
    };
    addTranslationModal.value = true;
};

const closeTranslationModal = () => {
    addTranslationModal.value = false;
    currentTranslation.value = null;
    initialTranslationData.value = null;
};

const { showToast } = useToast();
const showMessage = (msg = '', type: 'success' | 'error' = 'success') => {
    showToast(msg, type);
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>