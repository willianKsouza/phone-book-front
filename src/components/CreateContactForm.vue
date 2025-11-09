<script setup>
import FormButton from '@/components/FormButton.vue'
import FormInput from '@/components/FormInput.vue'
import { useContactStore } from '@/stores/useContactStore'
import { ArrowLeft, Camera } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import z from 'zod'

const router = useRouter()
const contactStore = useContactStore()

const form = ref({
  name: '',
  phone: '',
  email: '',
})

const formZodErrors = ref({})
const avatarZodErrors = ref(null)

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }), //
  email: z.email({ message: 'Email inválido' }),
  phone: z
    .string()
    .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos' })
    .regex(/^[0-9()\-\s+]+$/, { message: 'Telefone contém caracteres inválidos' }),
})

const preview = ref(null)

const avatarFile = ref(null)

const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Formato de imagem inválido. Use JPEG, PNG ou WEBP.'
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'A imagem deve ter no máximo 5 MB.'
    ),
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) {
    return
  }

  const result = avatarSchema.safeParse({ avatar: file })
  
  if (!result.success) {
   
    avatarZodErrors.value = 'a imagem deve ser png, jpeg ou webp'
    return
  }
  avatarFile.value = file

  const reader = new FileReader()
  reader.onload = (event) => {
    preview.value = event.target.result
  }
  reader.readAsDataURL(file)
}

async function submit() {
  const formData = new FormData()

  formData.append('name', form.value.name)
  formData.append('phone', form.value.phone)
  formData.append('email', form.value.email)

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

  if (avatarFile.value) {
    formData.append('avatar', avatarFile.value)
  }

  try {
    await contactStore.createContact(formData)

    router.push({ name: 'home' })
  } catch (error) {
    console.log('errooo', error)
  }
}
</script>

<template>
  <section class="flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="flex items-center gap-2">
        <RouterLink to="/">
          <ArrowLeft size="32" />
        </RouterLink>
        <p class="text-lg font-medium">Back</p>
      </div>
      <div class="mt-4">
        <h1 class="text-2xl font-medium">Create contact</h1>
      </div>

      <div class="relative w-28 h-28 mx-auto mt-4">
        <img
          :src="preview || 'https://placehold.co/40x40'"
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
          @change="onFileChange"
        />
      </div>
      <p
        v-if="avatarZodErrors"
        class="text-red-500 text-sm mt-1"
      >
        {{ avatarZodErrors }}
      </p>

      <div>
        <form
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
          <div class="flex items-center gap-2 mt-4">
            <FormButton
              title="Back"
              mode="secondary"
              routeName="home"
            />
            <FormButton title="Save" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
