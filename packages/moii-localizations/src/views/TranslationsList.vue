<template>
    <div>
        <TranslationsHeader
            title="Translation Strings"
            v-model:selectedLanguage="selectedLanguage"
            v-model:searchQuery="searchQuery"
            :availableLanguages="languagesStore.activeLanguages"
            @add="editTranslation()"
        />

        <div v-if="selectedLanguage" class="mt-5 panel p-0 border-0 overflow-hidden">
            <div class="table-responsive">
                <table class="table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th class="!text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="translationsStore.loading">
                            <td colspan="3" class="text-center py-4">
                                <div class="inline-block animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10"></div>
                            </td>
                        </tr>
                        <tr v-else-if="translationsStore.error">
                            <td colspan="3" class="text-center py-4 text-danger">
                                {{ translationsStore.error }}
                            </td>
                        </tr>
                        <tr v-else-if="filteredTranslations.length === 0">
                            <td colspan="3" class="text-center py-4 text-white-dark">
                                No translations found
                            </td>
                        </tr>
                        <template v-else v-for="item in filteredTranslations" :key="item.key">
                            <tr>
                                <td>
                                    <div class="font-semibold">{{ item.key }}</div>
                                </td>
                                <td>
                                    <div class="max-w-md truncate" :title="item.value">
                                        {{ item.value }}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex gap-4 items-center justify-center">
                                        <button type="button" class="btn btn-sm btn-outline-primary" @click="editTranslation(item)">
                                            Edit
                                        </button>
                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteTranslation(item)">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
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
            :languageCode="selectedLanguage"
            @close="addTranslationModal = false"
            @save="saveTranslation"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { useLanguagesStore } from '../stores/languages';
import { useTranslationsStore } from '../stores/translations';
import TranslationsHeader from '../components/TranslationsHeader.vue';
import TranslationModal from '../components/TranslationModal.vue';

const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();

const selectedLanguage = ref('');
const searchQuery = ref('');
const addTranslationModal = ref(false);
const currentTranslation = ref<{ key: string; value: string } | null>(null);

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

onMounted(async () => {
    await languagesStore.fetchLanguages();
    if (languagesStore.activeLanguages.length > 0) {
        selectedLanguage.value = languagesStore.activeLanguages[0].code;
        await loadTranslations();
    }
});

// Watch for language changes
watch(selectedLanguage, async (newVal) => {
    if (newVal) {
        await loadTranslations();
    }
});

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

const showMessage = (msg = '', type = 'success') => {
    const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};
</script>
