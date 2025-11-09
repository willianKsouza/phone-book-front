<script setup>
import { UserPlus } from 'lucide-vue-next'
defineProps({
  mobile: Boolean,
})
</script>

<template>
  <RouterLink
    v-if="mobile"
    class="flex w-full items-center justify-center rounded bg-secondary text-white size-10"
    :to="{ name: 'create' }"
  >
    <UserPlus />
  </RouterLink>
  <RouterLink
    v-else
    class="fixed bottom-3 right-3 flex items-center justify-center rounded-full bg-secondary text-white size-14"
    :to="{ name: 'create' }"
  >
    <UserPlus />
  </RouterLink>
</template>
