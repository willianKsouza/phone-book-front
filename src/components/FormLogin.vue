<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { z } from 'zod'

const router = useRouter()
const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const form = ref({
    email: '',
    password: '',
})
const loading = ref(false)
const formZodErrors = ref({})

const formSchema = z.object({
    email: z.email({ message: 'Email inválido' }),
    password: z.string().min(4, { message: 'A senha deve ter pelo menos 4 caracteres' }),
})

const submit = async () => {
    loading.value = true

    if (error.value) {
        error.value = null
    }

    const result = formSchema.safeParse({
        email: form.value.email,
        password: form.value.password,
    })

    if (!result.success) {
        result.error.issues.forEach((issue) => {
            formZodErrors.value[issue.path[0]] = issue.message
        })
        return
    }
    formZodErrors.value = {}

    await authStore.login(form.value)

    if (authStore.isAuthenticated) {
        router.push({ name: 'home' })
    }
}
</script>

<template>
    <div class="container flex flex-col items-center justify-center bg-zinc-100 min-h-screen px-4">
        <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Sign up</h1>
                <p class="text-gray-600">Faça login para acessar sua agenda</p>
            </div>
            <form class="space-y-6" @submit.prevent="submit">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2"> Email </label>
                    <input
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                        id="email" type="text" v-model="form.email" placeholder="seu@email.com" />
                    <p v-if="formZodErrors.email" class="text-red-500 text-sm mt-1">
                        {{ formZodErrors.email }}
                    </p>
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2"> Senha </label>
                    <input type="password" id="password" v-model="form.password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                        placeholder="••••••••" />
                    <p v-if="formZodErrors.password" class="text-red-500 text-sm mt-1">
                        {{ formZodErrors.password }}
                    </p>
                </div>
                <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {{ error }}
                </div>

                <button type="submit" :disabled="loading" class="w-full bg-button hover:bg-button text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2
                           flex justify-center items-center min-h-12">

                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Entrar</span>
                </button>
            </form>
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
