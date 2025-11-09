<script setup>
import { EllipsisVertical } from 'lucide-vue-next'
defineProps({
  name: String,
  phone: String,
  email: String,
  avatar: String,
})
</script>
<template>
  <div
    class="grid grid-cols-[80%_1fr] xs:grid-cols-3 md:grid-cols-4 gap-4 items-center py-2 rounded-lg hover:bg-primary/10 active:bg-primary/10 cursor-pointer"
  >
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full overflow-hidden">
        <img
          :src="avatar ? avatar : 'https://placehold.co/40x40'"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="whitespace-nowrap overflow-x-hidden text-ellipsis">{{ name }}</p>
    </div>
    <div class="hidden xs:block whitespace-nowrap">+55 11 99999-9999</div>
    <div class="hidden md:block">Alexandre@gmail.com</div>
    <div class="cursor-pointer">
      <EllipsisVertical
        @click="() => console.log('contato')"
        class="justify-self-end text-secondary size-10 rounded-full p-2 hover:bg-primary/20 hover:text-white"
      />
    </div>
  </div>
</template>
