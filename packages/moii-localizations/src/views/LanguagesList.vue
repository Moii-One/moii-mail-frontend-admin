<template>
    <div>
        <LanguagesHeader
            title="Languages Management"
            v-model:filters="filters"
            @add="editLanguage()"
        />

        <!-- Languages Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-globe class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ languagesStore.languages.length }}</h3>
                        <p class="text-white-dark text-sm">Total Languages</p>
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
                        <h3 class="text-xl font-semibold">{{ languagesStore.activeLanguages.length }}</h3>
                        <p class="text-white-dark text-sm">Active Languages</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-x class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ languagesStore.languages.length - languagesStore.activeLanguages.length }}</h3>
                        <p class="text-white-dark text-sm">Inactive Languages</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-star class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ languagesStore.defaultLanguage ? 1 : 0 }}</h3>
                        <p class="text-white-dark text-sm">Default Language</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="displayedLanguages"
                    :columns="cols"
                    :totalRows="displayedLanguages?.length"
                    :search="filters.search"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #code="data">
                        <div class="font-semibold">{{ data.value.code }}</div>
                    </template>
                    <template #name="data">
                        {{ data.value.name }}
                    </template>
                    <template #native_name="data">
                        {{ data.value.native_name || '-' }}
                    </template>
                    <template #is_active="data">
                        <span class="badge" :class="data.value.is_active ? 'badge-outline-success' : 'badge-outline-danger'">
                            {{ data.value.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </template>
                    <template #is_default="data">
                        <span v-if="data.value.is_default" class="badge badge-outline-primary">
                            Default
                        </span>
                        <span v-else>-</span>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button type="button" class="btn btn-sm btn-outline-info" @click="duplicateLanguage(data.value)">
                                <icon-copy class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="editLanguage(data.value)">
                                <icon-edit class="w-4 h-4" />
                            </button>
                            <button 
                                v-if="!data.value.is_default" 
                                type="button" 
                                class="btn btn-sm btn-outline-info" 
                                @click="setAsDefault(data.value)"
                                :title="'Set as Default'"
                            >
                                <icon-star class="w-4 h-4" />
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-sm btn-outline-warning" 
                                @click="toggleActiveStatus(data.value)"
                                :title="data.value.is_active ? 'Deactivate' : 'Activate'"
                            >
                                <icon-square-check v-if="!data.value.is_active" class="w-4 h-4" />
                                <icon-x v-else class="w-4 h-4" />
                            </button>
                            <button 
                                v-if="!data.value.is_default"
                                type="button" 
                                class="btn btn-sm btn-outline-danger" 
                                @click="deleteLanguage(data.value)"
                            >
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- Add/Edit Language Modal -->
        <LanguageModal
            :show="addLanguageModal"
            :language="currentLanguage"
            @close="addLanguageModal = false"
            @save="saveLanguage"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import { useLanguagesStore, type Language } from '../stores/languages';
import LanguagesHeader, { type LanguageFilterModel } from '../components/LanguagesHeader.vue';
import LanguageModal from '../components/LanguageModal.vue';
import IconGlobe from '../components/icon/icon-globe.vue';
import IconSquareCheck from '../components/icon/icon-square-check.vue';
import IconX from '../components/icon/icon-x.vue';
import IconStar from '../components/icon/icon-star.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconCopy from '../components/icon/icon-copy.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { useTranslationsStore } from '../stores/translations';

const languagesStore = useLanguagesStore();
const translationsStore = useTranslationsStore();

const addLanguageModal = ref(false);
const currentLanguage = ref<Language | null>(null);
const filters = ref<LanguageFilterModel>({
    search: '',
    status: '',
    type: ''
});

const cols = ref([
    { field: 'code', title: 'Code' },
    { field: 'name', title: 'Name' },
    { field: 'native_name', title: 'Native Name' },
    { field: 'is_active', title: 'Status' },
    { field: 'is_default', title: 'Default' },
    { field: 'actions', title: 'Actions', isUnique: true },
]);

// Track duplication source
const duplicatingFrom = ref<string | null>(null);

// Filter languages based on selection
const displayedLanguages = computed(() => {
    let filtered = languagesStore.languages;

    // Apply search filter
    if (filters.value.search) {
        const query = filters.value.search.toLowerCase();
        filtered = filtered.filter(language => 
            language.name.toLowerCase().includes(query) ||
            language.code.toLowerCase().includes(query) ||
            (language.native_name && language.native_name.toLowerCase().includes(query))
        );
    }

    // Apply status filter
    if (filters.value.status) {
        const isActive = filters.value.status === 'active';
        filtered = filtered.filter(language => language.is_active === isActive);
    }

    // Apply type filter
    if (filters.value.type) {
        if (filters.value.type === 'default') {
            filtered = filtered.filter(language => language.is_default);
        } else if (filters.value.type === 'non-default') {
            filtered = filtered.filter(language => !language.is_default);
        }
    }

    return filtered;
});

onMounted(async () => {
    await languagesStore.fetchLanguages();
});

const editLanguage = (language: Language | null = null) => {
    currentLanguage.value = language;
    addLanguageModal.value = true;
};

const saveLanguage = async (formData: Partial<Language>) => {
    if (!formData.code) {
        showMessage('Language code is required.', 'error');
        return;
    }
    if (!formData.name) {
        showMessage('Language name is required.', 'error');
        return;
    }

    try {
        let newLanguage;
        if (formData.uuid) {
            await languagesStore.updateLanguage(formData.uuid, formData);
            showMessage('Language has been updated successfully.');
        } else {
            newLanguage = await languagesStore.createLanguage({
                code: formData.code,
                name: formData.name,
                native_name: formData.native_name,
                is_active: formData.is_active ?? true,
            });
            showMessage('Language has been added successfully.');
            
            // If this is a duplication, copy translations from source language
            if (duplicatingFrom.value) {
                try {
                    showMessage('Copying translations from source language...', 'info');
                    
                    // Fetch translations from the source language
                    await translationsStore.fetchTranslations(duplicatingFrom.value);
                    const sourceTranslations = translationsStore.translations;
                    
                    // Create translation entries for the new language
                    const translationData: Record<string, string> = {};
                    
                    // Flatten the nested translation object into key-value pairs
                    const flattenTranslations = (obj: any, prefix = ''): Array<{ key: string; value: any }> => {
                        const items: Array<{ key: string; value: any }> = [];
                        
                        for (const [key, value] of Object.entries(obj)) {
                            const fullKey = prefix ? `${prefix}.${key}` : key;
                            
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                items.push(...flattenTranslations(value, fullKey));
                            } else {
                                items.push({ key: fullKey, value: value });
                            }
                        }
                        
                        return items;
                    };
                    
                    const flattenedTranslations = flattenTranslations(sourceTranslations);
                    
                    // Prepare bulk data
                    for (const item of flattenedTranslations) {
                        translationData[item.key] = `${item.value}`;
                    }
                    
                    // Use bulk update API
                    await translationsStore.bulkUpdate(formData.code, translationData);
                    showMessage(`Language duplicated successfully with ${flattenedTranslations.length} translation keys!`);
                    
                } catch (translationError) {
                    console.error('Error copying translations:', translationError);
                    showMessage('Language created but failed to copy translations.', 'warning');
                }
            }
        }

        addLanguageModal.value = false;
        currentLanguage.value = null;
        duplicatingFrom.value = null; // Reset duplication flag
    } catch (err) {
        showMessage('Failed to save language.', 'error');
    }
};

const duplicateLanguage = (language: Language) => {
    // Create a copy of the language with modified code and name
    const duplicatedLanguage = {
        ...language,
        code: `${language.code}_copy`,
        name: `${language.name} (Copy)`,
        uuid: undefined, // Remove UUID so it creates a new language
        is_default: false, // New language shouldn't be default
        is_active: false, // Start as inactive
    };
    duplicatingFrom.value = language.code; // Track the source language for duplication
    currentLanguage.value = duplicatedLanguage;
    addLanguageModal.value = true;
};

const deleteLanguage = async (language: Language) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `You are about to delete the language "${language.name}". This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });

    if (result.isConfirmed && language.uuid) {
        try {
            await languagesStore.deleteLanguage(language.uuid);
            showMessage('Language has been deleted successfully.');
        } catch (err) {
            showMessage('Failed to delete language.', 'error');
        }
    }
};

const setAsDefault = async (language: Language) => {
    if (!language.uuid) return;
    try {
        await languagesStore.setDefault(language.uuid);
        showMessage(`"${language.name}" has been set as the default language.`);
    } catch (err) {
        showMessage('Failed to set default language.', 'error');
    }
};

const toggleActiveStatus = async (language: Language) => {
    if (!language.uuid) return;
    try {
        const oldStatus = language.is_active;
        await languagesStore.toggleActive(language.uuid);
        const newStatus = oldStatus ? 'deactivated' : 'activated';
        showMessage(`"${language.name}" has been ${newStatus}.`);
    } catch (err) {
        showMessage('Failed to toggle language status.', 'error');
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

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>

