import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useExampleStore = defineStore('example', () => {
    // State
    const exampleData = ref<string>('Hello from moii-example package!');
    const counter = ref<number>(0);
    const userPreferences = ref({
        theme: 'light',
        language: 'en'
    });

    // Getters
    const doubleCounter = computed(() => counter.value * 2);
    const isDarkTheme = computed(() => userPreferences.value.theme === 'dark');

    // Actions
    function incrementCounter() {
        counter.value++;
    }

    function decrementCounter() {
        counter.value--;
    }

    function setTheme(theme: string) {
        userPreferences.value.theme = theme;
    }

    function setLanguage(language: string) {
        userPreferences.value.language = language;
    }

    function updateExampleData(data: string) {
        exampleData.value = data;
    }

    return {
        // State
        exampleData,
        counter,
        userPreferences,

        // Getters
        doubleCounter,
        isDarkTheme,

        // Actions
        incrementCounter,
        decrementCounter,
        setTheme,
        setLanguage,
        updateExampleData
    };
});
