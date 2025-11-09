import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuMobileStore = defineStore('menuMobile', () => {
    const isMenuOpen = ref(false)
    function toggleMenu() {
        isMenuOpen.value = !isMenuOpen.value
    }

  return {
    isMenuOpen,
    toggleMenu
   }
})
