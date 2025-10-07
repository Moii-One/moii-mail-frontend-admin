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
                                {{ setting?.id ? 'Edit Setting' : 'Add Setting' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="$emit('save', formData)">
                                    <div class="mb-5">
                                        <label for="key">Key *</label>
                                        <input 
                                            id="key" 
                                            type="text" 
                                            placeholder="Enter key (e.g., app_name)" 
                                            class="form-input" 
                                            v-model="formData.key"
                                            :disabled="!!setting?.id"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="value">Value *</label>
                                        <textarea
                                            id="value"
                                            rows="3"
                                            placeholder="Enter value"
                                            class="form-textarea resize-none min-h-[100px]"
                                            v-model="formData.value"
                                        ></textarea>
                                    </div>
                                    <div class="mb-5">
                                        <label for="type">Type *</label>
                                        <select id="type" class="form-select text-white-dark" v-model="formData.type">
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="json">JSON</option>
                                            <option value="array">Array</option>
                                        </select>
                                    </div>
                                    <div class="mb-5">
                                        <label for="group">Group</label>
                                        <input 
                                            id="group" 
                                            type="text" 
                                            placeholder="Enter group (e.g., general, email)" 
                                            class="form-input" 
                                            v-model="formData.group"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="description">Description</label>
                                        <textarea
                                            id="description"
                                            rows="2"
                                            placeholder="Enter description"
                                            class="form-textarea resize-none min-h-[80px]"
                                            v-model="formData.description"
                                        ></textarea>
                                    </div>
                                    <div class="mb-5">
                                        <label class="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                class="form-checkbox" 
                                                v-model="formData.is_public"
                                            />
                                            <span class="text-white-dark ltr:ml-2 rtl:mr-2">Public (visible to frontend)</span>
                                        </label>
                                    </div>
                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {{ setting?.id ? 'Update' : 'Add' }}
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
import IconX from '@/components/icon/icon-x.vue';
import type { Setting } from '../stores/settings';

const props = defineProps<{
    show: boolean;
    setting?: Setting | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: Partial<Setting>): void;
}>();

const formData = ref<Partial<Setting>>({
    key: '',
    value: '',
    type: 'string',
    group: '',
    description: '',
    is_public: false,
});

// Watch for setting changes to update form
watch(() => props.setting, (newSetting) => {
    if (newSetting) {
        formData.value = {
            ...newSetting,
            // Convert value to string for textarea
            value: typeof newSetting.value !== 'string' ? JSON.stringify(newSetting.value) : newSetting.value,
        };
    } else {
        // Reset form
        formData.value = {
            key: '',
            value: '',
            type: 'string',
            group: '',
            description: '',
            is_public: false,
        };
    }
}, { immediate: true });
</script>
