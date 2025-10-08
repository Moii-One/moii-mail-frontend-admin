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
                                {{ language?.uuid ? 'Edit Language' : 'Add Language' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="$emit('save', formData)">
                                    <div class="mb-5">
                                        <label for="code">Language Code *</label>
                                        <input 
                                            id="code" 
                                            type="text" 
                                            placeholder="Enter language code (e.g., en, es, fr)" 
                                            class="form-input" 
                                            v-model="formData.code"
                                            :disabled="!!language?.uuid"
                                            maxlength="3"
                                        />
                                        <small class="text-white-dark">ISO 639-1 language code (2-3 letters)</small>
                                    </div>
                                    <div class="mb-5">
                                        <label for="name">Name *</label>
                                        <input 
                                            id="name" 
                                            type="text" 
                                            placeholder="Enter language name (e.g., English)" 
                                            class="form-input" 
                                            v-model="formData.name"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="native_name">Native Name</label>
                                        <input 
                                            id="native_name" 
                                            type="text" 
                                            placeholder="Enter native name (e.g., English)" 
                                            class="form-input" 
                                            v-model="formData.native_name"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label class="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                class="form-checkbox" 
                                                v-model="formData.is_active"
                                            />
                                            <span class="text-white-dark ltr:ml-2 rtl:mr-2">Active</span>
                                        </label>
                                    </div>
                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {{ language?.uuid ? 'Update' : 'Add' }}
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
import type { Language } from '../stores/languages';

const props = defineProps<{
    show: boolean;
    language?: Language | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: Partial<Language>): void;
}>();

const formData = ref<Partial<Language>>({
    code: '',
    name: '',
    native_name: '',
    is_active: true,
});

// Watch for language changes to update form
watch(() => props.language, (newLanguage) => {
    if (newLanguage) {
        formData.value = {
            ...newLanguage,
        };
    } else {
        // Reset form
        formData.value = {
            code: '',
            name: '',
            native_name: '',
            is_active: true,
        };
    }
}, { immediate: true });
</script>
