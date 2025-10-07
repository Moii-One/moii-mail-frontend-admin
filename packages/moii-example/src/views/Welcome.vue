<template>
    <div class="welcome-page">
        <div class="max-w-2xl mx-auto text-center">
            <h1 class="text-4xl font-bold text-primary mb-6">Welcome to moii-example Package</h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                This is a demonstration package showing how multiple packages can work together
                with the main authentication system.
            </p>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 class="text-2xl font-semibold mb-4">Package Features</h2>
                <div class="grid md:grid-cols-2 gap-4 text-left">
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Independent routing system</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Package-specific authentication rules</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Dedicated Pinia store</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Composable architecture</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link
                    to="/example/public-demo"
                    class="btn btn-primary"
                >
                    View Public Demo
                </router-link>
                <router-link
                    to="/example/dashboard"
                    class="btn btn-outline-primary"
                >
                    Try Protected Routes
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMeta } from '../../../moii-auth/src/composables/use-meta';

useMeta({ title: 'Welcome - moii-example' });
</script>

<style scoped>
.welcome-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
}
</style>
