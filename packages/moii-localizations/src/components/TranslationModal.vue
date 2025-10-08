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
                                {{ translation?.key ? 'Edit Translation' : 'Add Translation' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="$emit('save', formData)">
                                    <div class="mb-5">
                                        <label for="key">Key *</label>
                                        <input 
                                            id="key" 
                                            type="text" 
                                            placeholder="Enter translation key (e.g., messages.welcome)" 
                                            class="form-input" 
                                            v-model="formData.key"
                                            :disabled="!!translation?.key"
                                        />
                                        <small class="text-white-dark">Must use two-level format with dot notation (e.g., messages.welcome, auth.login.title)</small>
                                    </div>
                                    <div class="mb-5">
                                        <label for="value">Translation Value *</label>
                                        <textarea
                                            id="value"
                                            rows="4"
                                            placeholder="Enter translation value"
                                            class="form-textarea resize-none min-h-[120px]"
                                            v-model="formData.value"
                                        ></textarea>
                                    </div>
                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {{ translation?.key ? 'Update' : 'Add' }}
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
import { ref, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
import IconX from './icon/icon-x.vue';

const props = defineProps<{
    show: boolean;
    translation?: { key: string; value: string } | null;
    languageCode: string;
    initialData?: Partial<{ key: string; value: string }> | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: { key: string; value: string }): void;
}>();

const formData = ref<{ key: string; value: string }>({
    key: '',
    value: '',
});

// Watch for translation changes to update form
watch(() => props.translation, (newTranslation) => {
    if (newTranslation) {
        formData.value = {
            key: newTranslation.key,
            value: newTranslation.value,
        };
    } else if (props.initialData) {
        // Use initial data for add mode with pre-filled values
        formData.value = {
            key: props.initialData.key || '',
            value: props.initialData.value || '',
        };
    } else {
        // Reset form
        formData.value = {
            key: '',
            value: '',
        };
    }
}, { immediate: true });

// Watch for initialData changes to update form
watch(() => props.initialData, (newInitialData) => {
    if (newInitialData && !props.translation) {
        formData.value = {
            key: newInitialData.key || '',
            value: newInitialData.value || '',
        };
    }
}, { immediate: true });
</script>
