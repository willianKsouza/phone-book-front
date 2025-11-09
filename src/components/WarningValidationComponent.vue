<script setup>
defineProps({
  msgError: String,
})
</script>

<template>
  <p class="text-red-500 text-sm mt-1">
    {{ msgError }}
  </p>
</template>
