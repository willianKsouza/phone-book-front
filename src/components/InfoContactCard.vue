<script setup>
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

defineProps({
  name: String,
  phone: String,
  email: String,
  created_at: String,
})
</script>
<template>
  <ul class="space-y-3">
    <li class="text-2xl font-bold capitalize">
      {{ name }}
    </li>

    <li class="flex flex-col items-start gap-2">
      <span class="text-lg font-semibold text-secondary">Phone</span>
      <span>{{ phone }}</span>
    </li>

    <li class="flex flex-col items-start gap-2">
      <span class="text-lg font-semibold text-secondary">E-mail</span>
      <span>{{ email }}</span>
    </li>
    <li class="text-sm text-secondary/50">
     Created on {{ formatDate(created_at) }}
    </li>
  </ul>
</template>
