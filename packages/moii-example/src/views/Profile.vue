<template>
    <div class="profile-page">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-primary mb-2">User Profile</h1>
            <p class="text-gray-600 dark:text-gray-300">
                Manage your profile settings in this example package.
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <!-- Profile Info -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Name</label>
                        <input
                            v-model="profile.name"
                            type="text"
                            class="form-input w-full"
                            placeholder="Enter your name"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Email</label>
                        <input
                            v-model="profile.email"
                            type="email"
                            class="form-input w-full"
                            placeholder="Enter your email"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            v-model="profile.bio"
                            class="form-input w-full"
                            rows="3"
                            placeholder="Tell us about yourself"
                        ></textarea>
                    </div>
                    <button
                        @click="saveProfile"
                        class="btn btn-primary w-full"
                    >
                        Save Profile
                    </button>
                </div>
            </div>

            <!-- Preferences -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Preferences</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Theme</label>
                        <select
                            v-model="theme"
                            @change="setTheme"
                            class="form-select w-full"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Language</label>
                        <select
                            v-model="language"
                            @change="setLanguage"
                            class="form-select w-full"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                    <div class="pt-4">
                        <router-link
                            to="/example/dashboard"
                            class="btn btn-outline-primary w-full text-center block"
                        >
                            ← Back to Dashboard
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMeta } from '../../../moii-auth/src/composables/use-meta';
import { useExampleStore } from '../stores/example';

useMeta({ title: 'Profile - moii-example' });

// Store
const exampleStore = useExampleStore();

// Local state
const profile = ref({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Example user in the moii-example package.'
});

// Computed
const theme = computed({
    get: () => exampleStore.userPreferences.theme,
    set: (value) => exampleStore.setTheme(value)
});

const language = computed({
    get: () => exampleStore.userPreferences.language,
    set: (value) => exampleStore.setLanguage(value)
});

// Actions
const setTheme = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    exampleStore.setTheme(target.value);
};

const setLanguage = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    exampleStore.setLanguage(target.value);
};

const saveProfile = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', profile.value);
    // Show success message
    alert('Profile saved successfully!');
};
</script>

<style scoped>
.profile-page {
    padding: 2rem 1rem;
}
</style>
