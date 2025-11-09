<script setup>
import HeaderApp from '@/components/HeaderApp.vue'
import SearchInput from '@/components/SearchInput.vue'
import MainContent from '@/components/MainContent.vue'
import FavoriteContacts from '@/components/FavoriteContacts.vue'
import { onMounted } from 'vue'
import { useContactStore } from '@/stores/useContactStore'

const contactStore = useContactStore()
onMounted(() => {
   contactStore.getContacts()
})

</script>
<template>
  <section class="relative flex flex-col h-screen">
    <HeaderApp class="p-4" />
    <div class="grow p-4">
      <SearchInput class="mt-4" />
      <FavoriteContacts class="mt-4" />
      <MainContent class="mt-4" />
    </div>
  </section>
</template>
