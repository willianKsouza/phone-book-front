<script setup>
import { useMenuMobileStore } from '@/stores/useMenuMobileStore'
import { ArrowLeft } from 'lucide-vue-next'
import FormButton from '@/components/FormButton.vue'
import { Trash2 } from 'lucide-vue-next'

const MenuMobileStore = useMenuMobileStore()
</script>
<template>
  <section
    @click.self="MenuMobileStore.toggleMenu"
    class="bg-black/30 w-screen h-screen fixed inset-0 z-50"
  >
    <div class="bg-white w-[65%] h-screen rounded shadow-lg flex flex-col gap-4 p-4">
      <div class="flex items-center gap-2">
        <button @click="MenuMobileStore.toggleMenu">
          <ArrowLeft size="32" />
        </button>
        <p class="text-lg font-medium">Back</p>
      </div>
      <div>
        <h1 class="text-lg font-bold text-primary">Nick Name</h1>
        <h2 class="text-zinc-400">Email@gmail.com</h2>
      </div>
      <nav class="grow">
        <ul class="space-y-2">
          <li class="flex items-center gap-2 bg-primary px-1 py-2 rounded-lg">
            <Trash2 class="text-secondary h-5 w-5" />
            <span class="text-lg translate-y-0.5 font-medium text-white">Trashed</span>
          </li>
          <li class="flex items-center gap-2 bg-primary px-1 py-2 rounded-lg">
            <Trash2 class="text-secondary h-5 w-5" />
            <span class="text-lg translate-y-0.5 font-medium text-white">Trashed</span>
          </li>
          <li class="flex items-center gap-2 bg-primary px-1 py-2 rounded-lg">
            <Trash2 class="text-secondary h-5 w-5" />
            <span class="text-lg translate-y-0.5 font-medium text-white">Trashed</span>
          </li>
        </ul>
      </nav>
      <div>
        <FormButton title="Logout" mode="secondary" />
      </div>
    </div>
  </section>
</template>
