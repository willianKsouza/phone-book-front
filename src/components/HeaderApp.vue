<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { BookUser, Menu, LogOut } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import MenuMobile from '@/components/modals/MenuMobile.vue'
import { useMenuMobileStore } from '@/stores/useMenuMobileStore'

const profile = ref('')
const authStore = useAuthStore()
const MenuMobileStore = useMenuMobileStore()

onMounted(() => {
  profile.value = authStore.user
})
</script>
<template>
  <header class="w-full bg-primary">
    <div class="flex items-center justify-between">
      <nav class="flex items-center gap-2 lg:hidden">
        <Menu class="text-white cursor-pointer hover:text-secondary active:text-secondary" @click="MenuMobileStore.toggleMenu" />
        <Transition name="slide-fade">
          <MenuMobile v-if="MenuMobileStore.isMenuOpen" />
        </Transition>
      </nav>
      <div class="flex gap-2 items-center">
        <h1 class="text-xl font-bold text-white">Contacts</h1>
        <BookUser class="text-secondary" />
      </div>
    </div>
    <div class="md:flex flex-row-reverse items-baseline justify-between">
      <nav class="hidden md:block">
        <ul class="flex items-center gap-4">
          <li>
            <button class="flex items-center gap-2 bg-secondary px-2 py-0.5 rounded-lg md:mt-2">
              <LogOut class="text-white" />
              <span class="text-lg font-medium text-white">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
      <h1 class="text-lg  font-medium text-white mt-1 text-end md:text-start">
        Welcome, {{ profile.name }}
      </h1>
    </div>
  </header>
</template>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
