<template>
    <div>
        <SettingsHeader
            title="System Settings"
            v-model="filters"
            :availableGroups="availableGroups"
            @add="editSetting()"
        />

        <div class="mt-5 panel p-0 border-0 overflow-hidden">
            <div class="table-responsive">
                <table class="table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Type</th>
                            <th>Group</th>
                            <th>Visibility</th>
                            <th class="!text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="settingsStore.loading">
                            <td colspan="6" class="text-center py-4">
                                <div class="inline-block animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10"></div>
                            </td>
                        </tr>
                        <tr v-else-if="settingsStore.error">
                            <td colspan="6" class="text-center py-4 text-danger">
                                {{ settingsStore.error }}
                            </td>
                        </tr>
                        <tr v-else-if="filteredSettings.length === 0">
                            <td colspan="6" class="text-center py-4 text-white-dark">
                                No settings found
                            </td>
                        </tr>
                        <template v-else v-for="setting in filteredSettings" :key="setting.uuid">
                            <tr>
                                <td>
                                    <div class="font-semibold">{{ setting.key }}</div>
                                    <div v-if="setting.description" class="text-xs text-white-dark mt-1">{{ setting.description }}</div>
                                </td>
                                <td>
                                    <div class="max-w-xs truncate" :title="formatValue(setting.value)">
                                        {{ formatValue(setting.value) }}
                                    </div>
                                </td>
                                <td>
                                    <span class="badge" :class="getTypeBadgeClass(setting.type)">
                                        {{ setting.type }}
                                    </span>
                                </td>
                                <td>{{ setting.group || '-' }}</td>
                                <td>
                                    <span class="badge" :class="setting.is_public ? 'badge-outline-success' : 'badge-outline-warning'">
                                        {{ setting.is_public ? 'Public' : 'Private' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="flex gap-4 items-center justify-center">
                                        <button type="button" class="btn btn-sm btn-outline-primary" @click="editSetting(setting)">Edit</button>
                                        <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteSetting(setting)">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
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

const settingsStore = useSettingsStore();

const addSettingModal = ref(false);
const currentSetting = ref<Setting | null>(null);
const filteredSettings = ref<Setting[]>([]);

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

// Watch settings and filters changes
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

    try {
        // Convert value based on type
        let processedValue = formData.value;
        if (formData.type === 'number') {
            processedValue = Number(formData.value);
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
            group: formData.group || null,
            description: formData.description || null,
            is_public: formData.is_public || false,
        };

        if (formData.id) {
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
        number: 'badge-outline-info',
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
</script>
