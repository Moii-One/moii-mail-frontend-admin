<template>
    <div>
        <LanguagesHeader
            title="Languages Management"
            v-model:selectedLanguage="filterLanguage"
            :availableLanguages="languagesStore.languages"
            @add="editLanguage()"
        />

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="table-responsive">
                <table class="table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Native Name</th>
                            <th>Status</th>
                            <th>Default</th>
                            <th class="!text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="languagesStore.loading">
                            <td colspan="6" class="text-center py-4">
                                <div class="inline-block animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10"></div>
                            </td>
                        </tr>
                        <tr v-else-if="languagesStore.error">
                            <td colspan="6" class="text-center py-4 text-danger">
                                {{ languagesStore.error }}
                            </td>
                        </tr>
                        <tr v-else-if="displayedLanguages.length === 0">
                            <td colspan="6" class="text-center py-4 text-white-dark">
                                No languages found
                            </td>
                        </tr>
                        <template v-else v-for="language in displayedLanguages" :key="language.code">
                            <tr>
                                <td>
                                    <div class="font-semibold">{{ language.code }}</div>
                                </td>
                                <td>{{ language.name }}</td>
                                <td>{{ language.native_name || '-' }}</td>
                                <td>
                                    <span class="badge" :class="language.is_active ? 'badge-outline-success' : 'badge-outline-danger'">
                                        {{ language.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="language.is_default" class="badge badge-outline-primary">
                                        Default
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <div class="flex gap-2 items-center justify-center">
                                        <button type="button" class="btn btn-sm btn-outline-primary" @click="editLanguage(language)">
                                            Edit
                                        </button>
                                        <button 
                                            v-if="!language.is_default" 
                                            type="button" 
                                            class="btn btn-sm btn-outline-info" 
                                            @click="setAsDefault(language)"
                                        >
                                            Set Default
                                        </button>
                                        <button 
                                            type="button" 
                                            class="btn btn-sm btn-outline-warning" 
                                            @click="toggleActiveStatus(language)"
                                        >
                                            {{ language.is_active ? 'Deactivate' : 'Activate' }}
                                        </button>
                                        <button 
                                            v-if="!language.is_default"
                                            type="button" 
                                            class="btn btn-sm btn-outline-danger" 
                                            @click="deleteLanguage(language)"
                                        >
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
import LanguagesHeader from '../components/LanguagesHeader.vue';
import LanguageModal from '../components/LanguageModal.vue';

const languagesStore = useLanguagesStore();

const addLanguageModal = ref(false);
const currentLanguage = ref<Language | null>(null);
const filterLanguage = ref('');

// Filter languages based on selection
const displayedLanguages = computed(() => {
    if (!filterLanguage.value) {
        return languagesStore.languages;
    }
    return languagesStore.languages.filter(lang => lang.code === filterLanguage.value);
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
        if (formData.id) {
            await languagesStore.updateLanguage(formData.id, formData);
            showMessage('Language has been updated successfully.');
        } else {
            await languagesStore.createLanguage({
                code: formData.code,
                name: formData.name,
                native_name: formData.native_name,
                is_active: formData.is_active ?? true,
            });
            showMessage('Language has been added successfully.');
        }

        addLanguageModal.value = false;
        currentLanguage.value = null;
    } catch (err) {
        showMessage('Failed to save language.', 'error');
    }
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

    if (result.isConfirmed && language.id) {
        try {
            await languagesStore.deleteLanguage(language.id);
            showMessage('Language has been deleted successfully.');
        } catch (err) {
            showMessage('Failed to delete language.', 'error');
        }
    }
};

const setAsDefault = async (language: Language) => {
    if (!language.id) return;
    try {
        await languagesStore.setDefault(language.id);
        showMessage(`"${language.name}" has been set as the default language.`);
    } catch (err) {
        showMessage('Failed to set default language.', 'error');
    }
};

const toggleActiveStatus = async (language: Language) => {
    if (!language.id) return;
    try {
        await languagesStore.toggleActive(language.id);
        const status = language.is_active ? 'deactivated' : 'activated';
        showMessage(`"${language.name}" has been ${status}.`);
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
