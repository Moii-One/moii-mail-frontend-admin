<template>
    <div>
        <FeatureFlagsHeader
            title="Feature Flags"
            v-model:filters="filters"
            @add="addFeature()"
        />
        
        <!-- Feature Flag Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-menu-components class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ featureFlagsStore.featuresList.length }}</h3>
                        <p class="text-white-dark text-sm">Total Features</p>
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
                        <h3 class="text-xl font-semibold">{{ featureFlagsStore.enabledFeatures.length }}</h3>
                        <p class="text-white-dark text-sm">Enabled Features</p>
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
                        <h3 class="text-xl font-semibold">{{ featureFlagsStore.disabledFeatures.length }}</h3>
                        <p class="text-white-dark text-sm">Disabled Features</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable">
                <vue3-datatable
                    :rows="filteredFeatures"
                    :columns="cols"
                    :totalRows="filteredFeatures?.length"
                    :search="filters.search"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #name="data">
                        <div class="font-semibold">{{ data.value.name }}</div>
                    </template>
                    <template #key="data">
                        <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{ data.value.key }}</code>
                    </template>
                    <template #description="data">
                        <div class="text-sm text-white-dark">{{ data.value.description || '-' }}</div>
                    </template>
                    <template #enabled="data">
                        <div class="flex items-center">
                            <label class="w-12 h-6 relative cursor-pointer" @click="handleToggle(data.value)" :class="{ 'opacity-50 cursor-not-allowed': featureFlagsStore.loading }">
                                <span :class="data.value.enabled ? 'bg-primary' : 'bg-[#ebedf2] dark:bg-dark'" class="block h-full rounded-full relative">
                                    <div class="absolute w-4 h-4 bg-white rounded-full top-1 transition-all duration-300" :style="{ left: data.value.enabled ? '28px' : '4px' }"></div>
                                </span>
                            </label>
                            <span class="ltr:ml-3 rtl:mr-3 text-sm" :class="data.value.enabled ? 'text-success' : 'text-danger'">
                                {{ data.value.enabled ? 'Enabled' : 'Disabled' }}
                            </span>
                        </div>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-2 items-center justify-center">
                            <button type="button" class="btn btn-sm btn-outline-info" @click="duplicateFeature(data.value)">
                                <icon-copy class="w-4 h-4" />
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" @click="editFeature(data.value)">
                                <icon-edit class="w-4 h-4" />
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-sm btn-outline-danger" 
                                @click="deleteFeature(data.value)"
                            >
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>

        <!-- Add/Edit Feature Modal -->
        <FeatureFlagModal
            :show="addFeatureModal"
            :feature="currentFeature"
            :initial-data="initialFeatureData"
            @close="closeFeatureModal"
            @save="saveFeature"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import { useFeatureFlagsStore } from '../stores/featureFlags';
import FeatureFlagsHeader, { type FeatureFlagFilterModel } from '../components/FeatureFlagsHeader.vue';
import FeatureFlagModal from '../components/FeatureFlagModal.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import IconMenuComponents from '../components/icon/menu/icon-menu-components.vue';
import IconSquareCheck from '../components/icon/icon-square-check.vue';
import IconX from '../components/icon/icon-x.vue';
import IconCopy from '../components/icon/icon-copy.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

interface FeatureFlag {
    key: string;
    name: string;
    enabled: boolean;
    description?: string;
}

interface FeatureFlagFormData {
    name: string;
    description: string;
    enabled: boolean;
}

const featureFlagsStore = useFeatureFlagsStore();

const addFeatureModal = ref(false);
const currentFeature = ref<FeatureFlag | null>(null);
const initialFeatureData = ref<Partial<FeatureFlagFormData> | null>(null);
const filters = ref<FeatureFlagFilterModel>({
    search: '',
    status: ''
});

const cols = ref([
    { field: 'name', title: 'Name' },
    { field: 'key', title: 'Key' },
    { field: 'description', title: 'Description' },
    { field: 'enabled', title: 'Status' },
    { field: 'actions', title: 'Actions', isUnique: true },
]);

// Filter features based on search and status
const filteredFeatures = computed(() => {
    let filtered = featureFlagsStore.featuresList;

    // Filter by search query
    if (filters.value.search) {
        const query = filters.value.search.toLowerCase();
        filtered = filtered.filter(feature => 
            feature.name.toLowerCase().includes(query) ||
            feature.key.toLowerCase().includes(query)
        );
    }

    // Filter by status
    if (filters.value.status) {
        filtered = filtered.filter(feature => 
            filters.value.status === 'enabled' ? feature.enabled : !feature.enabled
        );
    }

    return filtered;
});

onMounted(async () => {
    await featureFlagsStore.fetchFeatures();
});

const addFeature = () => {
    currentFeature.value = null;
    initialFeatureData.value = null;
    addFeatureModal.value = true;
};

const editFeature = (feature: FeatureFlag) => {
    currentFeature.value = feature;
    initialFeatureData.value = null;
    addFeatureModal.value = true;
};

const duplicateFeature = (feature: FeatureFlag) => {
    console.log('Duplicating feature:', feature);
    currentFeature.value = null;
    initialFeatureData.value = {
        name: feature.key.replace('feature.', '') + '_copy',
        description: feature.description || '',
        enabled: false, // Start disabled by default
    };
    console.log('Set initialFeatureData to:', initialFeatureData.value);
    addFeatureModal.value = true;
};

const closeFeatureModal = () => {
    addFeatureModal.value = false;
    currentFeature.value = null;
    initialFeatureData.value = null;
};

const saveFeature = async (formData: FeatureFlagFormData) => {
    try {
        if (!currentFeature.value) {
            // This is a new feature - create it with description
            await featureFlagsStore.createFeature(formData.name, formData.description, formData.enabled);
            showMessage('Feature flag has been created successfully.');
        } else {
            // This is editing an existing feature - update description and status
            await featureFlagsStore.updateFeature(
                currentFeature.value.key.replace('feature.', ''), 
                formData.description, 
                formData.enabled
            );
            showMessage('Feature flag has been updated successfully.');
        }

        addFeatureModal.value = false;
        currentFeature.value = null;
        initialFeatureData.value = null;
    } catch (err) {
        showMessage('Failed to save feature flag.', 'error');
    }
};

const toggleFeature = async (feature: FeatureFlag, enabled: boolean) => {
    console.log('Toggling feature:', feature.key, 'to', enabled);
    try {
        await featureFlagsStore.toggleFeature(feature.key.replace('feature.', ''), enabled);
        const status = enabled ? 'enabled' : 'disabled';
        showMessage(`"${feature.name}" has been ${status}.`);
    } catch (err) {
        console.error('Error toggling feature:', err);
        showMessage('Failed to toggle feature flag.', 'error');
    }
};

const handleToggle = (feature: FeatureFlag) => {
    if (!featureFlagsStore.loading) {
        toggleFeature(feature, !feature.enabled);
    }
};

const deleteFeature = async (feature: FeatureFlag) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: `You are about to delete the feature flag "${feature.name}". This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        padding: '2em',
        customClass: { container: 'sweet-alerts' },
    });

    if (result.isConfirmed) {
        try {
            await featureFlagsStore.deleteFeature(feature.key.replace('feature.', ''));
            showMessage('Feature flag has been deleted successfully.');
        } catch (err) {
            showMessage('Failed to delete feature flag.', 'error');
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

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>