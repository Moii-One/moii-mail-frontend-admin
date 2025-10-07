<template>
    <div class="settings-page">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-primary mb-2">Settings</h1>
            <p class="text-gray-600 dark:text-gray-300">
                Configure your preferences and account settings.
            </p>
        </div>

        <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Account Settings -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Account Settings</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            v-model="settings.currentPassword"
                            type="password"
                            class="form-input w-full"
                            placeholder="Enter current password"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">New Password</label>
                        <input
                            v-model="settings.newPassword"
                            type="password"
                            class="form-input w-full"
                            placeholder="Enter new password"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            v-model="settings.confirmPassword"
                            type="password"
                            class="form-input w-full"
                            placeholder="Confirm new password"
                        >
                    </div>
                    <button
                        @click="changePassword"
                        class="btn btn-primary w-full"
                        :disabled="!canChangePassword"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            <!-- Package Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Package Information</h2>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Package Name:</span>
                        <span class="font-medium">moii-example</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Version:</span>
                        <span class="font-medium">0.0.1</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Status:</span>
                        <span class="text-green-500 font-medium">Active</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Auth Integration:</span>
                        <span class="text-green-500 font-medium">✓ Working</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Store:</span>
                        <span class="text-green-500 font-medium">✓ Pinia</span>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t">
                    <router-link
                        to="/example/dashboard"
                        class="btn btn-outline-primary w-full text-center block"
                    >
                        ← Back to Dashboard
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Demo Actions -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Demo Actions</h2>
            <div class="grid md:grid-cols-3 gap-4">
                <button
                    @click="showPackageInfo"
                    class="btn btn-outline-info"
                >
                    Show Package Info
                </button>
                <button
                    @click="testStore"
                    class="btn btn-outline-success"
                >
                    Test Store
                </button>
                <button
                    @click="clearData"
                    class="btn btn-outline-warning"
                >
                    Clear Demo Data
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMeta } from '../../../moii-auth/src/composables/use-meta';
import { useExampleStore } from '../stores/example';

useMeta({ title: 'Settings - moii-example' });

// Store
const exampleStore = useExampleStore();

// Local state
const settings = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Computed
const canChangePassword = computed(() => {
    return settings.value.currentPassword &&
           settings.value.newPassword &&
           settings.value.confirmPassword &&
           settings.value.newPassword === settings.value.confirmPassword;
});

// Actions
const changePassword = () => {
    // In a real app, this would call an API
    console.log('Changing password...');
    alert('Password changed successfully! (Demo only)');
    settings.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
};

const showPackageInfo = () => {
    alert(`Package: moii-example
Version: 0.0.1
Description: Example package demonstrating multi-package authentication integration
Status: Active and working with main auth system`);
};

const testStore = () => {
    const info = `Store Test Results:
- Counter: ${exampleStore.counter}
- Double Counter: ${exampleStore.doubleCounter}
- Theme: ${exampleStore.userPreferences.theme}
- Language: ${exampleStore.userPreferences.language}
- Data: ${exampleStore.exampleData}`;
    alert(info);
};

const clearData = () => {
    if (confirm('Are you sure you want to clear demo data?')) {
        exampleStore.updateExampleData('Hello from moii-example package!');
        // Note: Counter and preferences would need reset methods in a real implementation
        alert('Demo data cleared!');
    }
};
</script>

<style scoped>
.settings-page {
    padding: 2rem 1rem;
}
</style>
