<template>
    <svg :class="class" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.4578 12C3.73207 7.94291 7.52236 5 12 5C16.4776 5 20.2679 7.94291 21.5422 12C20.2679 16.0571 16.4776 19 12 19C7.52236 19 3.73207 16.0571 2.4578 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</template>

<script lang="ts" setup>
interface Props {
    class?: string;
}

defineProps<Props>();
</script>
