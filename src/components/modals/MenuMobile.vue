<script setup>
import { useMenuMobileStore } from '@/stores/useMenuMobileStore'
import { ArrowLeft } from 'lucide-vue-next'
import FormButton from '@/components/FormButton.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import CreateContactButton from '../CreateContactButton.vue'

const MenuMobileStore = useMenuMobileStore()
const authStore = useAuthStore()

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
        <h1 class="text-lg font-bold text-primary">{{ authStore.userComputed.name }}</h1>
        <h2 class="text-zinc-400">{{ authStore.userComputed.email }}</h2>
      </div>
      <nav class="grow">
        <CreateContactButton :mobile="true"/>
      </nav>
      <div>
        <FormButton @click="authStore.logout" title="Logout" mode="secondary" />
      </div>
    </div>
  </section>
</template>
