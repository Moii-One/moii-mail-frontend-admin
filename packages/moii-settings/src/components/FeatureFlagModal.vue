<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                @click="$emit('close')"
                            >
                                <icon-x />
                            </button>
                            <div class="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {{ isEdit ? 'Edit Feature Flag' : 'Add Feature Flag' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="handleSubmit">
                                    <div class="mb-5">
                                        <label for="name">Feature Name *</label>
                                        <input 
                                            id="name" 
                                            type="text" 
                                            placeholder="Enter feature name (e.g., new_dashboard, beta_ui)" 
                                            class="form-input" 
                                            v-model="formData.name"
                                            :disabled="isEdit"
                                        />
                                        <small class="text-white-dark">Use lowercase with underscores (will be prefixed with 'feature.')</small>
                                    </div>
                                    
                                    <div class="mb-5">
                                        <label for="description">Description</label>
                                        <textarea 
                                            id="description" 
                                            placeholder="Enter feature description..." 
                                            class="form-textarea" 
                                            v-model="formData.description"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    
                                    <div class="mb-5">
                                        <label class="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                class="form-checkbox" 
                                                v-model="formData.enabled"
                                            />
                                            <span class="text-white-dark ltr:ml-2 rtl:mr-2">Enable this feature</span>
                                        </label>
                                    </div>
                                    
                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {{ isEdit ? 'Update' : 'Add' }}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
import IconX from './icon/icon-x.vue';

interface FeatureFlagFormData {
    name: string;
    description: string;
    enabled: boolean;
}

interface FeatureFlag {
    key: string;
    name: string;
    enabled: boolean;
    description?: string;
}

const props = defineProps<{
    show: boolean;
    feature?: FeatureFlag | null;
    initialData?: Partial<FeatureFlagFormData> | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: FeatureFlagFormData): void;
}>();

const formData = ref<FeatureFlagFormData>({
    name: '',
    description: '',
    enabled: true,
});

const isEdit = computed(() => !!props.feature);

// Watch for feature changes to update form
watch(() => props.feature, (newFeature) => {
    if (newFeature) {
        formData.value = {
            name: newFeature.key.replace('feature.', ''),
            description: newFeature.description || '',
            enabled: newFeature.enabled,
        };
    } else if (props.initialData) {
        // Use initial data for add mode with pre-filled values
        formData.value = {
            name: props.initialData.name || '',
            description: props.initialData.description || '',
            enabled: props.initialData.enabled ?? true,
        };
    } else {
        // Reset form
        formData.value = {
            name: '',
            description: '',
            enabled: true,
        };
    }
}, { immediate: true });

// Watch for initialData changes to update form
watch(() => props.initialData, (newInitialData) => {
    if (newInitialData && !props.feature) {
        formData.value = {
            name: newInitialData.name || '',
            description: newInitialData.description || '',
            enabled: newInitialData.enabled ?? true,
        };
    }
}, { immediate: true });

const handleSubmit = () => {
    if (!formData.value.name.trim()) {
        return;
    }
    emit('save', formData.value);
};
</script>
