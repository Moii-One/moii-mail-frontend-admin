<template>
    <div>
        <SettingsHeader
            title="System Settings"
            v-model="filters"
            :availableGroups="availableGroups"
            @add="editSetting()"
        />
        
        <!-- Settings Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-settings class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ settingsStore.settings.length }}</h3>
                        <p class="text-white-dark text-sm">Total Settings</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-eye class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ settingsStore.publicSettings.length }}</h3>
                        <p class="text-white-dark text-sm">Public Settings</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-lock class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ settingsStore.settings.length - settingsStore.publicSettings.length }}</h3>
                        <p class="text-white-dark text-sm">Private Settings</p>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center">
                            <icon-menu-components class="w-6 h-6 text-info" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ Object.keys(settingsStore.settingsByGroup).length }}</h3>
                        <p class="text-white-dark text-sm">Setting Groups</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="filteredSettings"
                    :columns="cols"
                    :totalRows="filteredSettings?.length"
                    :search="filters.search"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #key="data">
                        <div class="font-semibold">{{ data.value.key }}</div>
                        <div v-if="data.value.description" class="text-xs text-white-dark mt-1">{{ data.value.description }}</div>
                    </template>
                    <template #value="data">
                        <div class="max-w-xs truncate" :title="formatValue(data.value.value)">
                            {{ formatValue(data.value.value) }}
                        </div>
                    </template>
                    <template #type="data">
                        <span class="badge" :class="getTypeBadgeClass(data.value.type)">
                            {{ data.value.type }}
                        </span>
                    </template>
                    <template #group="data">
                        {{ data.value.group || '-' }}
                    </template>
                    <template #is_public="data">
                        <span class="badge" :class="data.value.is_public ? 'badge-outline-success' : 'badge-outline-warning'">
                            {{ data.value.is_public ? 'Public' : 'Private' }}
                        </span>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button type="button" class="btn btn-sm btn-outline-info" @click="duplicateSetting(data.value)">
                                <icon-copy class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="editSetting(data.value)">
                                <icon-edit class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteSetting(data.value)">
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- Add/Edit Setting Modal -->
        <SettingModal
            :show="addSettingModal"
            :setting="currentSetting"
            @close="addSettingModal = false"
            @save="saveSetting"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import Swal from 'sweetalert2';
import { useSettingsStore, type Setting } from '../stores/settings';
import SettingsHeader, { type FilterModel } from '../components/SettingsHeader.vue';
import SettingModal from '../components/SettingModal.vue';
import IconSettings from '../components/icon/icon-settings.vue';
import IconEye from '../components/icon/icon-eye.vue';
import IconLock from '../components/icon/icon-lock.vue';
import IconMenuComponents from '../components/icon/menu/icon-menu-components.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconCopy from '../components/icon/icon-copy.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const settingsStore = useSettingsStore();

const addSettingModal = ref(false);
const currentSetting = ref<Setting | null>(null);
const filteredSettings = ref<Setting[]>([]);

const cols = ref([
    { field: 'key', title: 'Key' },
    { field: 'value', title: 'Value' },
    { field: 'type', title: 'Type' },
    { field: 'group', title: 'Group' },
    { field: 'is_public', title: 'Visibility' },
    { field: 'actions', title: 'Actions', isUnique: true },
]);

const filters = ref<FilterModel>({
    search: '',
    type: '',
    group: '',
    visibility: ''
});

// Computed available groups from settings
const availableGroups = computed(() => {
    const groups = new Set(settingsStore.settings.map(s => s.group).filter(Boolean));
    return Array.from(groups) as string[];
});

onMounted(async () => {
    await settingsStore.fetchSettings();
    applyFilters();
});

const applyFilters = () => {
    let results = [...settingsStore.settings];

    // Apply search filter
    if (filters.value.search) {
        const term = filters.value.search.toLowerCase();
        results = results.filter((s) => 
            s.key.toLowerCase().includes(term) || 
            (s.group && s.group.toLowerCase().includes(term)) ||
            (s.description && s.description.toLowerCase().includes(term))
        );
    }

    // Apply type filter
    if (filters.value.type) {
        results = results.filter(s => s.type === filters.value.type);
    }

    // Apply group filter
    if (filters.value.group) {
        results = results.filter(s => s.group === filters.value.group);
    }

    // Apply visibility filter
    if (filters.value.visibility) {
        const isPublic = filters.value.visibility === 'public';
        results = results.filter(s => s.is_public === isPublic);
    }

    filteredSettings.value = results;
};

watch(() => settingsStore.settings, () => {
    applyFilters();
}, { deep: true });

watch(filters, () => {
    applyFilters();
}, { deep: true });

const editSetting = (setting: Setting | null = null) => {
    currentSetting.value = setting;
    addSettingModal.value = true;
};

const saveSetting = async (formData: Partial<Setting>) => {
    if (!formData.key) {
        showMessage('Key is required.', 'error');
        return;
    }
    if (!formData.value) {
        showMessage('Value is required.', 'error');
        return;
    }
    if (!formData.type) {
        showMessage('Type is required.', 'error');
        return;
    }
    if (!formData.group) {
        showMessage('Group is required.', 'error');
        return;
    }

    try {
        // Convert value based on type
        let processedValue = formData.value;
        if (formData.type === 'integer') {
            processedValue = parseInt(formData.value as string, 10);
        } else if (formData.type === 'float') {
            processedValue = parseFloat(formData.value as string);
        } else if (formData.type === 'boolean') {
            processedValue = formData.value === 'true' || formData.value === '1' || formData.value === true;
        } else if (formData.type === 'json' || formData.type === 'array') {
            try {
                processedValue = JSON.parse(formData.value as string);
            } catch (e) {
                showMessage('Invalid JSON format', 'error');
                return;
            }
        }

        const settingData = {
            key: formData.key,
            value: processedValue,
            type: formData.type,
            group: formData.group,
            description: formData.description || null,
            is_public: formData.is_public || false,
        };

        if (formData.uuid) {
            await settingsStore.updateSetting(formData.uuid!, settingData);
            showMessage('Setting has been updated successfully.');
        } else {
            await settingsStore.createSetting(settingData);
            showMessage('Setting has been added successfully.');
        }

        addSettingModal.value = false;
        currentSetting.value = null;
    } catch (err) {
        showMessage('Failed to save setting.', 'error');
    }
};

const deleteSetting = async (setting: Setting) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `You are about to delete the setting "${setting.key}". This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });

    if (result.isConfirmed && setting.uuid) {
        try {
            await settingsStore.deleteSetting(setting.uuid);
            showMessage('Setting has been deleted successfully.');
        } catch (err) {
            showMessage('Failed to delete setting.', 'error');
        }
    }
};

const formatValue = (value: any): string => {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
};

const getTypeBadgeClass = (type: string): string => {
    const classes: Record<string, string> = {
        string: 'badge-outline-primary',
        integer: 'badge-outline-info',
        float: 'badge-outline-info',
        boolean: 'badge-outline-success',
        json: 'badge-outline-warning',
        array: 'badge-outline-danger',
    };
    return classes[type] || 'badge-outline-secondary';
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

const duplicateSetting = (setting: Setting) => {
    // Create a copy of the setting with a modified key
    const duplicatedSetting = {
        ...setting,
        key: `${setting.key}_copy`,
        uuid: undefined, // Remove UUID so it creates a new setting
        group: setting.group || 'general', // Ensure group has a default value
    };
    currentSetting.value = duplicatedSetting;
    addSettingModal.value = true;
};
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
