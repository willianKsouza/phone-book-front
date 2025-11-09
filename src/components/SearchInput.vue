<script setup>
import { useContactStore } from '@/stores/useContactStore'
import { Search } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const searchQuery = ref('')
const contactStore = useContactStore()
let debounceTimeout = null

const selectedField = ref('name') // Nome pré-selecionado (agora é string, não array)

const fields = [
  { value: 'name', label: 'Nome' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefone' },
]

watch(
  [searchQuery], // Observa ambos
  ([newQuery]) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    debounceTimeout = setTimeout(() => {
      contactStore.getContacts(newQuery, selectedField.value)
    }, 500)
  },
  { immediate: true },
)
</script>

<template>
  <section>
    <div class="flex items-center bg-white rounded-2xl px-2 py-1 shadow-sm">
        <div class="pr-4"></div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="flex-1 focus:outline-none placeholder:text-center text-black"
      />
      <Search class="text-secondary" />
    </div>

    <div class="flex items-center gap-4 mt-3 px-2">
      <label
        v-for="field in fields"
        :key="field.value"
        class="flex items-center gap-2 cursor-pointer group"
      >
        <input
          type="radio"
          :value="field.value"
          v-model="selectedField"
          class="sr-only peer"
          :name="'search-field'"
        />
        <div
          class="relative w-5 h-5 border-2 border-gray-300 rounded-full transition-all peer-checked:border-secondary group-hover:border-secondary/50 flex items-center justify-center"
        >
          <div
            class="w-2.5 h-2.5 bg-secondary rounded-full opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-transform"
          ></div>
        </div>
        <span class="text-sm text-gray-700 group-hover:text-secondary transition-colors">
          {{ field.label }}
        </span>
      </label>
    </div>
  </section>
</template>
