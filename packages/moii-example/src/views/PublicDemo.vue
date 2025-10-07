<template>
    <div class="public-demo-page">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-primary mb-4">Public Demo Page</h1>
                <p class="text-gray-600 dark:text-gray-300">
                    This page is publicly accessible and doesn't require authentication.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">Package Information</h2>
                    <div class="space-y-2">
                        <p><strong>Package:</strong> moii-example</p>
                        <p><strong>Version:</strong> 0.0.1</p>
                        <p><strong>Status:</strong> <span class="text-green-500">Active</span></p>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">Navigation</h2>
                    <div class="space-y-3">
                        <router-link
                            to="/example/welcome"
                            class="block btn btn-sm btn-outline-primary w-full text-center"
                        >
                            ← Back to Welcome
                        </router-link>
                        <router-link
                            to="/example/dashboard"
                            class="block btn btn-sm btn-primary w-full text-center"
                        >
                            Try Dashboard (Protected)
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Package Architecture Demo</h2>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">🗂️</div>
                        <h3 class="font-semibold">Router</h3>
                        <p class="text-sm text-gray-600">Independent routing system</p>
                    </div>
                    <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">🏪</div>
                        <h3 class="font-semibold">Store</h3>
                        <p class="text-sm text-gray-600">Dedicated Pinia store</p>
                    </div>
                    <div class="text-center p-4 border rounded">
                        <div class="text-2xl mb-2">🔐</div>
                        <h3 class="font-semibold">Auth</h3>
                        <p class="text-sm text-gray-600">Package-specific rules</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMeta } from '../../../moii-auth/src/composables/use-meta';

useMeta({ title: 'Public Demo - moii-example' });
</script>

<style scoped>
.public-demo-page {
    padding: 2rem 1rem;
    min-height: 100vh;
}
</style>
