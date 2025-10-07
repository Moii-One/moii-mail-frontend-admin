<template>
    <div class="dashboard-page">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-primary mb-2">Example Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-300">
                Welcome to the protected dashboard! This page requires authentication.
            </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Counter Demo -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Counter Demo</h2>
                <div class="text-center">
                    <div class="text-4xl font-bold text-primary mb-4">{{ counter }}</div>
                    <div class="text-sm text-gray-600 mb-4">Double: {{ doubleCounter }}</div>
                    <div class="flex gap-2 justify-center">
                        <button
                            @click="decrementCounter"
                            class="btn btn-sm btn-outline-danger"
                        >
                            -1
                        </button>
                        <button
                            @click="incrementCounter"
                            class="btn btn-sm btn-primary"
                        >
                            +1
                        </button>
                    </div>
                </div>
            </div>

            <!-- User Info -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">User Information</h2>
                <div class="space-y-2">
                    <p><strong>Status:</strong>
                        <span class="text-green-500 ml-2">Authenticated ✓</span>
                    </p>
                    <p><strong>Package:</strong> moii-example</p>
                    <p><strong>Route:</strong> Protected</p>
                </div>
            </div>

            <!-- Navigation -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Navigation</h2>
                <div class="space-y-2">
                    <router-link
                        to="/example/profile"
                        class="block btn btn-sm btn-outline-primary w-full text-center"
                    >
                        Profile
                    </router-link>
                    <router-link
                        to="/example/settings"
                        class="block btn btn-sm btn-outline-primary w-full text-center"
                    >
                        Settings
                    </router-link>
                    <router-link
                        to="/"
                        class="block btn btn-sm btn-secondary w-full text-center"
                    >
                        Main Dashboard
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Package Data Demo -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Package Data Demo</h2>
            <div class="mb-4">
                <p class="mb-2">{{ exampleData }}</p>
                <input
                    v-model="newData"
                    type="text"
                    placeholder="Enter new data..."
                    class="form-input w-full max-w-md"
                >
                <button
                    @click="updateData"
                    class="btn btn-primary ml-2"
                >
                    Update
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMeta } from '../../../moii-auth/src/composables/use-meta';
import { useExampleStore } from '../stores/example';

useMeta({ title: 'Dashboard - moii-example' });

// Store
const exampleStore = useExampleStore();

// Reactive data
const newData = ref('');

// Computed
const counter = computed(() => exampleStore.counter);
const doubleCounter = computed(() => exampleStore.doubleCounter);
const exampleData = computed(() => exampleStore.exampleData);

// Actions
const incrementCounter = () => exampleStore.incrementCounter();
const decrementCounter = () => exampleStore.decrementCounter();

const updateData = () => {
    if (newData.value.trim()) {
        exampleStore.updateExampleData(newData.value);
        newData.value = '';
    }
};
</script>

<style scoped>
.dashboard-page {
    padding: 2rem 1rem;
}
</style>
