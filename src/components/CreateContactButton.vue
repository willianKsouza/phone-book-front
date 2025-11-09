<script setup>
import { UserPlus } from 'lucide-vue-next';
</script>

<template>
    <RouterLink class="flex items-center justify-center rounded-full bg-secondary text-white size-14" :to="{ name: 'create'}">
         <UserPlus />
    </RouterLink>
</template>