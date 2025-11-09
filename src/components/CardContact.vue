<script setup>
defineProps({
  name: String,
  phone: String,
  email: String,
  avatar: String,
})
</script>
<template>
  <div
    class="grid grid-cols-[80%_1fr] xs:grid-cols-3 md:grid-cols-4 gap-4 items-center px-2 py-2 rounded-lg hover:bg-primary active:bg-primary/5 cursor-pointer text-gray-700 hover:text-white"
  >
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full overflow-hidden">

        <img
          :src="avatar || 'https://robohash.org/31090d1bcf1a3f5237f4283497e3f84f?set=set4&bgset=&size=400x400'"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="whitespace-nowrap overflow-x-hidden text-ellipsis">{{ name }}</p>
    </div>
    <div class="hidden xs:block whitespace-nowrap">{{ phone }}</div>
    <div class="hidden md:block">{{ email }}</div>
  </div>
</template>
