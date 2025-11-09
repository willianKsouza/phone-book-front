<script setup>
import { Camera, Info, Pencil, Trash2, X } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import { ref, watch } from 'vue'
import z from 'zod'
import { useContactStore } from '@/stores/useContactStore'
import DeleteContactWarningModal from '@/components/modals/DeleteContactWarningModal.vue'
import InfoContactCard from '@/components/InfoContactCard.vue'
import FormButton from '@/components/FormButton.vue'
import WarningValidationComponent from '@/components/WarningValidationComponent.vue'

const emit = defineEmits(['close-modal'])

const contactStore = useContactStore()

const props = defineProps({
  contact: Object,
})

const isSucess = ref(true)

const isUpdated = ref(false)

const loading = ref(false)

const errorSubmitForm = ref(false)

const controlViewComponent = ref('info')


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


async function deleteContact() {
  await contactStore.deleteContact(form.value.id)
  emit('close-modal')

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
            @click="controlViewComponent = 'info'"
            class="size-10 rounded-full flex items-center justify-center hover:bg-primary"
          >
            <Info class="text-secondary" />
          </div>
          <div
            @click="controlViewComponent = 'edit'"
            class="size-10 rounded-full flex items-center justify-center hover:bg-primary"
          >
            <Pencil class="text-secondary" />
          </div>
          <div
            @click="controlViewComponent = 'delete'"
            class="size-10 rounded-full flex items-center justify-center hover:bg-primary"
          >
            <Trash2 class="text-secondary" />
          </div>
        </div>
      </div>
      <div>
        <WarningValidationComponent
          v-if="avatarZodErrors"
          :msgError="avatarZodErrors"
        />
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

      <Transition
        name="slide-fade"
        mode="out-in"
      >
        <div
          v-if="controlViewComponent === 'info'"
          key="info"
          class="bg-primary text-white rounded p-4 shadow-md min-h-32 flex flex-col justify-center"
        >
          <InfoContactCard
            :name="form.name"
            :phone="form.phone"
            :email="form.email"
            :created_at="contact.created_at"
          />
        </div>
        <div
          v-else-if="controlViewComponent === 'edit'"
          key="edit"
        >
          <form
            class="space-y-6"
            @submit.prevent="submit"
          >
            <FormInput
              label="Name"
              placeholder="Name"
              v-model="form.name"
            />
            <WarningValidationComponent
              v-if="formZodErrors.name"
              :msgError="formZodErrors.name"
            />

            <FormInput
              label="Phone"
              placeholder="Phone"
              v-model="form.phone"
            />
            <WarningValidationComponent
              v-if="formZodErrors.phone"
              :msgError="formZodErrors.phone"
            />

            <FormInput
              label="E-mail"
              placeholder="E-mail"
              v-model="form.email"
            />
            <WarningValidationComponent
              v-if="formZodErrors.email"
              :msgError="formZodErrors.email"
            />

            <WarningValidationComponent
              v-if="errorSubmitForm"
              msgError="Ocorreu um erro ao atualizar o contato."
            />

            <div class="flex items-center gap-2 mt-4">
              <FormButton
                title="Back"
                mode="secondary"
                @click="$emit('close-modal')"
              />
              <FormButton
                title="Save"
                :loading="loading"
                :disabled="loading"
              />
            </div>
          </form>
        </div>

        <DeleteContactWarningModal
          v-else-if="controlViewComponent === 'delete'"
          @close-warning="controlViewComponent = 'info'"
          @confirm-warning="deleteContact"
          key="delete"
        />
      </Transition>
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
