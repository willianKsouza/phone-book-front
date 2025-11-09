<script setup>
import { Search, FunnelPlus } from 'lucide-vue-next'
</script>

<template>
    <div class="flex items-center bg-white rounded-2xl px-2 py-1 shadow-sm">
        <FunnelPlus class="text-secondary mr-2" />
        <input type="text" placeholder="Search..." class="flex-1 focus:outline-none placeholder:text-center text-black" />
        <Search class="text-secondary" />
    </div>
</template>
