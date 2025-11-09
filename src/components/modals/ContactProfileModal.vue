<script setup>
import { Camera, Pencil, Trash2, X } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import { ref, watch } from 'vue'
import z from 'zod'
import { useContactStore } from '@/stores/useContactStore'


defineEmits(['close-modal'])

const contactStore = useContactStore()

const props = defineProps({
  contact: Object,
})

const isSucess = ref(true)

const isUpdated = ref(false)

const loading = ref(false)

const errorSubmitForm = ref(false)

const isEdit = ref(false)

const isDelete = ref(true)


const form = ref({
  id: '',
  name: '',
  phone: '',
  email: '',
})
const avatarZodErrors = ref(null)
const formZodErrors = ref({})

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }), //
  email: z.email({ message: 'Email inválido' }),
  phone: z
    .string()
    .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos' })
    .regex(/^[0-9()\-\s+]+$/, { message: 'Telefone contém caracteres inválidos' }),
})

const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Formato de imagem inválido. Use JPEG, PNG ou WEBP.',
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, 'A imagem deve ter no máximo 5 MB.'),
})

const preview = ref(null)

async function submitUploadAvatar(e) {
  isUpdated.value = true

  const file = e.target.files[0]

  if (!file) {
    return
  }
  const result = avatarSchema.safeParse({ avatar: file })

  if (!result.success) {
    isUpdated.value = false
    avatarZodErrors.value = 'a imagem deve ser png, jpeg ou webp'
    return
  }

  preview.value = file

  const reader = new FileReader()
  reader.onload = (event) => {
    preview.value = event.target.result
  }

  reader.readAsDataURL(file)

  const formData = new FormData()

  formData.append('avatar', file)
  formData.append('_method', 'PATCH')

  await contactStore.updateAvatar(form.value.id, formData).then(() => {
    isSucess.value = false
    isUpdated.value = false
    avatarZodErrors.value = null
  })
}

async function submit() {
  loading.value = true

  const result = formSchema.safeParse({
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
  })

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      formZodErrors.value[issue.path[0]] = issue.message
    })
    return
  }
  try {
    await contactStore.updateContact(form.value).finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
  } catch (err) {
    errorSubmitForm.value = true
  }
}

watch(
  () => props.contact,
  (contact) => {
    if (contact) {
      form.value.id = contact.id
      form.value.name = contact.name
      form.value.phone = contact.phone
      form.value.email = contact.email
      form.value.avatar = contact.avatar
    }
  },
  { immediate: true },
)
</script>
<template>
  <div
    class="fixed inset-0 p-4 bg-black/20 z-50 flex items-center justify-center"
    @click.self="$emit('close-modal')"
  >
    <div class="w-full max-w-md bg-white rounded shadow-lg p-4">
      <div class="flex items-center justify-between gap-2">
        <h1 class="text-2xl font-medium">Profile Contact</h1>
        <x
          @click="$emit('close-modal')"
          size="32"
        />
      </div>
      <div class="relative w-28 h-28 mx-auto mt-4">
        <img
          :src="preview ? preview : form.avatar"
          alt="Profile photo"
          class="w-full h-full object-cover rounded-full border border-gray-300"
        />
        <label
          for="fileInput"
          class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
        >
          <Camera class="w-5 h-5 text-secondary" />
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/jpeg, image/png, image/webp"
          class="hidden"
          @change="submitUploadAvatar"
        />
      </div>
      <div class="p-2 flex justify-end">
        <div class="ml-auto flex items-center gap-2">
          <div
            @click="isEdit = !isEdit"
            class="size-10 rounded-full flex items-center justify-center hover:bg-primary"
          >
            <Pencil class="text-secondary" />
          </div>
          <div class="size-10 rounded-full flex items-center justify-center hover:bg-primary">
            <Trash2 class="text-secondary" />
          </div>
        </div>
      </div>
      <div>
        <p
          v-if="avatarZodErrors"
          class="text-red-500 text-sm p-4"
        >
          {{ avatarZodErrors }}
        </p>

        <div
          v-if="isUpdated"
          class="w-full bg-button text-white font-semibold p-2 rounded-lg transition duration-200 flex justify-center items-center min-h-10 my-4"
        >
          <span
            v-if="isSucess"
            class="spinner"
          ></span>
          <span v-else>Saved</span>
        </div>
      </div>
      <div>
        <form
          v-if="isEdit"
          class="space-y-6"
          @submit.prevent="submit"
        >
          <FormInput
            label="Name"
            placeholder="Name"
            v-model="form.name"
          />
          <p
            v-if="formZodErrors.name"
            class="text-red-500 text-sm mt-1"
          >
            {{ formZodErrors.name }}
          </p>
          <FormInput
            label="Phone"
            placeholder="Phone"
            v-model="form.phone"
          />
          <p
            v-if="formZodErrors.phone"
            class="text-red-500 text-sm mt-1"
          >
            {{ formZodErrors.phone }}
          </p>
          <FormInput
            label="E-mail"
            placeholder="E-mail"
            v-model="form.email"
          />
          <p
            v-if="formZodErrors.email"
            class="text-red-500 text-sm mt-1"
          >
            {{ formZodErrors.email }}
          </p>
          <div v-if="errorSubmitForm">
            <p class="text-red-500">Ocorreu um erro ao atualizar o contato.</p>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <button
              class="w-full border border-gray-400 hover:bg-button text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
              @click="$emit('close-modal')"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-button hover:bg-button text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
            >
              <span
                v-if="loading"
                class="spinner"
              ></span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
        <div
          v-else
          class="bg-primary text-white rounded p-4 shadow-md min-h-32 flex flex-col justify-center"
        >
          <div
            v-if="isDelete"
            class=" flex items-center justify-center"
          >
            <div class="bg-primary rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
              <h2 class="text-lg font-semibold mb-4">Confirmar exclusão</h2>
              <p class="mb-6 text-white">
                Tem certeza que deseja deletar este contato?
              </p>
              <div class="flex justify-between gap-4">
                <button
                  @click="isDelete = false"
                  class="w-1/2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-black/30 transition"
                >
                  Cancelar
                </button>
                <button
                  @click="deleteContact(form.id)"
                  class="w-1/2 py-2 px-4 bg-secondary text-white rounded-lg hover:bg-secondary/60 transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>



          <ul v-else class="space-y-2">
            <li class="text-2xl font-bold tracking-wide capitalize">{{ form.name }}</li>
            <li class="text-base opacity-90 flex items-center gap-2">
              <span class="material-icons text-sm opacity-80">Phone</span>
              {{ form.phone }}
            </li>
            <li class="text-base opacity-90 flex items-center gap-2">
              <span class="material-icons text-sm opacity-80">E-mail</span>
              {{ form.email }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
