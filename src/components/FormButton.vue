<script setup>
import { ref } from 'vue'

const loading = ref(false)


defineProps({
    title: String,
    mode: {
        type: String,
        default: 'primary',
    },
    routeName: String,
})
</script>

<template>
    <button v-if="mode == 'primary'" type="submit" :disabled="loading"
        class="w-full bg-button hover:bg-button text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12">
        <span v-if="loading" class="spinner"></span>
        <span v-else>{{ title }}</span>
    </button>
    <RouterLink v-if="mode == 'secondary'" :to="{ name: routeName }" class="w-full border border-gray-400 hover:bg-button text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12">
        {{ title }}
    </RouterLink>
</template>
<style>
.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>