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
                                {{ tenant?.uuid ? 'Edit Tenant' : 'Add Tenant' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="$emit('save', formData)">
                                    <div class="mb-5">
                                        <label for="name">Name *</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter tenant name"
                                            class="form-input"
                                            v-model="formData.name"
                                            required
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="slug">Slug</label>
                                        <input
                                            id="slug"
                                            type="text"
                                            placeholder="Auto-generated from name"
                                            class="form-input"
                                            v-model="formData.slug"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="status">Status *</label>
                                        <CustomSelect
                                            :model-value="formData.status"
                                            :options="statusOptions"
                                            placeholder="Select Status"
                                            :allow-empty="false"
                                            @update:model-value="formData.status = $event"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="apps">Apps</label>
                                        <CustomSelect
                                            :model-value="formData.app_uuids"
                                            :options="appOptions"
                                            placeholder="Select apps"
                                            :multiple="true"
                                            @update:model-value="formData.app_uuids = $event"
                                        />
                                    </div>
                                    <div class="mb-5">
                                        <label for="description">Description</label>
                                        <textarea
                                            id="description"
                                            rows="3"
                                            placeholder="Enter tenant description"
                                            class="form-textarea resize-none min-h-[80px]"
                                            v-model="formData.description"
                                        ></textarea>
                                    </div>
                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" @click="$emit('close')" class="btn btn-outline-danger">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            :disabled="loading"
                                        >
                                            <div v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {{ tenant?.uuid ? 'Update' : 'Create' }} Tenant
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
import { ref, watch, onMounted, computed } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
import CustomSelect from './CustomSelect.vue';
import { useTenantsStore } from '../stores/tenants';
import type { Tenant, App } from '../stores/tenants';

interface Props {
    show: boolean;
    tenant?: Tenant | null;
    loading?: boolean;
}

interface Emits {
    (e: 'close'): void;
    (e: 'save', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const tenantsStore = useTenantsStore();

const formData = ref({
    name: '',
    slug: '',
    status: 'active' as 'active' | 'inactive' | 'blocked',
    description: '',
    app_uuids: [] as string[],
});

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'blocked', label: 'Blocked' },
];

const appOptions = computed(() => 
    tenantsStore.apps.map(app => ({
        value: app.uuid,
        label: app.name,
    }))
);

// Auto-generate slug from name
watch(() => formData.value.name, (newName) => {
    if (newName) {
        formData.value.slug = newName.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
});

// Watch for tenant prop changes to populate form
watch(() => props.tenant, (newTenant) => {
    if (newTenant) {
        formData.value = {
            name: newTenant.name || '',
            slug: newTenant.slug || '',
            status: newTenant.status || 'active',
            description: newTenant.description || '',
            app_uuids: newTenant.apps?.map(a => a.uuid) || [],
        };
    } else {
        // Reset form for new tenant
        formData.value = {
            name: '',
            slug: '',
            status: 'active',
            description: '',
            app_uuids: [],
        };
    }
}, { immediate: true });

// Fetch apps on mount
onMounted(async () => {
    if (tenantsStore.apps.length === 0) {
        try {
            await tenantsStore.fetchApps();
        } catch (error) {
            console.error('Failed to fetch apps:', error);
        }
    }
});
</script>

<script lang="ts">
import IconX from './icon/icon-x.vue';

export default {
    components: {
        IconX,
    },
};
</script>

<style scoped>
/* Force multiselect dropdowns to be visible above everything */
:deep(.multiselect__content-wrapper) {
    position: absolute !important;
    z-index: 99999 !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    background: white !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 6px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    width: 100% !important;
    min-width: 200px !important;
    top: 100% !important;
    left: 0 !important;
    display: none !important; /* Hide by default */
}

/* Force the multiselect container to allow overflow */
:deep(.multiselect) {
    position: relative !important;
    z-index: 1000 !important;
}

/* Show dropdown only when multiselect is active */
:deep(.multiselect--active .multiselect__content-wrapper) {
    display: block !important;
    position: absolute !important;
    visibility: visible !important;
}

/* Aggressive overflow control for all parent containers */
:deep(.multiselect--active),
:deep([data-height-collapsible] .multiselect--active),
:deep([data-height-collapsible] .panel .multiselect--active),
:deep(.space-y-4 [data-height-collapsible] .multiselect--active) {
    overflow: visible !important;
}

/* Ensure the entire collapsible allows overflow when any multiselect is active */
:deep([data-height-collapsible]:has(.multiselect--active)) {
    overflow: visible !important;
}

:deep([data-height-collapsible] .panel:has(.multiselect--active)) {
    overflow: visible !important;
}
</style>
