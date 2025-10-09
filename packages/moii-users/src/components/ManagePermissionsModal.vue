<template>
    <div class="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto hidden" :class="{ '!block': showModal }">
        <div class="flex items-start justify-center min-h-screen px-4 pt-6">
            <div
                class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn"
                @click.stop
            >
                <div class="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                    <h5 class="font-bold text-lg">Manage Permissions: {{ role?.name }}</h5>
                    <button type="button" @click="$emit('close')" class="text-white-dark hover:text-dark">
                        <icon-x class="w-5 h-5" />
                    </button>
                </div>
                <div class="p-5">
                    <div class="mb-5">
                        <div class="flex items-center justify-between mb-3">
                            <h6 class="font-semibold">Available Permissions</h6>
                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    class="btn btn-outline-success btn-sm"
                                    @click="selectAllPermissions"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-outline-warning btn-sm"
                                    @click="deselectAllPermissions"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>
                        <div class="max-h-96 overflow-y-auto border rounded p-3 space-y-2">
                            <div
                                v-for="group in groupedPermissions"
                                :key="group.category"
                                class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                            >
                                <button
                                    type="button"
                                    @click="toggleCategory(group.category)"
                                    class="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-sm">{{ group.category.charAt(0).toUpperCase() + group.category.slice(1) }}</span>
                                        <span class="badge badge-outline-primary text-xs">{{ group.count }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button
                                            type="button"
                                            class="btn btn-outline-success btn-xs"
                                            @click.stop="selectAllInCategory(group.category)"
                                            title="Select all in category"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-outline-warning btn-xs"
                                            @click.stop="deselectAllInCategory(group.category)"
                                            title="Deselect all in category"
                                        >
                                            Deselect All
                                        </button>
                                        <svg
                                            class="w-4 h-4 transition-transform ml-2"
                                            :class="{ 'rotate-180': expandedCategories[group.category] }"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </button>

                                <div v-if="expandedCategories[group.category]" class="p-3 bg-white dark:bg-gray-900 space-y-2">
                                    <label
                                        v-for="permission in group.permissions"
                                        :key="permission.uuid"
                                        class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            :value="permission.key"
                                            v-model="selectedPermissions"
                                            class="form-checkbox mt-0.5"
                                        />
                                        <div class="flex-1">
                                            <div class="font-medium text-sm">{{ permission.key }}</div>
                                            <div class="text-xs text-white-dark" v-if="permission.description">
                                                {{ permission.description }}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end items-center mt-8">
                        <button type="button" @click="$emit('close')" class="btn btn-outline-danger">
                            Cancel
                        </button>
                        <button
                            type="button"
                            @click="savePermissions"
                            class="btn btn-primary ltr:ml-4 rtl:mr-4"
                            :disabled="loading"
                        >
                            <div v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Save Permissions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRolesStore, type Role } from '../stores/roles';
import IconX from './icon/icon-x.vue';

interface Props {
    showModal: boolean;
    role: Role | null;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const emit = defineEmits<{
    close: [];
    save: [permissions: string[]];
}>();

const rolesStore = useRolesStore();
const selectedPermissions = ref<string[]>([]);
const expandedCategories = ref<Record<string, boolean>>({});

const groupedPermissions = computed(() => {
    const groups: Record<string, any[]> = {};

    rolesStore.permissions.forEach(permission => {
        const category = permission.key.split('.')[0] || 'other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
    });

    return Object.entries(groups).map(([category, permissions]) => ({
        category,
        permissions,
        count: permissions.length
    })).sort((a, b) => a.category.localeCompare(b.category));
});

// Watch for role changes to update selected permissions
watch(() => props.role, (newRole) => {
    if (newRole) {
        selectedPermissions.value = newRole.permissions?.map(p => p.key) || [];

        // Expand all categories by default
        expandedCategories.value = {};
        groupedPermissions.value.forEach(group => {
            expandedCategories.value[group.category] = true;
        });
    }
}, { immediate: true });

const toggleCategory = (category: string) => {
    expandedCategories.value[category] = !expandedCategories.value[category];
};

const selectAllPermissions = () => {
    selectedPermissions.value = rolesStore.permissions.map(p => p.key);
};

const deselectAllPermissions = () => {
    selectedPermissions.value = [];
};

const selectAllInCategory = (category: string) => {
    const categoryPermissions = rolesStore.permissions.filter(p => p.key.startsWith(category + '.'));
    const categoryKeys = categoryPermissions.map(p => p.key);

    // Add all permissions from this category that aren't already selected
    const newSelections = categoryKeys.filter(key => !selectedPermissions.value.includes(key));
    selectedPermissions.value = [...selectedPermissions.value, ...newSelections];
};

const deselectAllInCategory = (category: string) => {
    const categoryPermissions = rolesStore.permissions.filter(p => p.key.startsWith(category + '.'));
    const categoryKeys = categoryPermissions.map(p => p.key);

    // Remove all permissions from this category
    selectedPermissions.value = selectedPermissions.value.filter(key => !categoryKeys.includes(key));
};

const savePermissions = () => {
    emit('save', selectedPermissions.value);
};
</script>

<style scoped>
.animate__animated {
    animation-duration: 0.3s;
}

.animate__fadeIn {
    animation-name: fadeIn;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
