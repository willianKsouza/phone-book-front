import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'
import { computed } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const userComputed = computed(() => user.value)
    const isAuthenticated = ref(false)
    const error = ref(null)


    async function getProfile() {
        try {
            const { data } = await axios.get('/api/users')
            user.value = data
            isAuthenticated.value = true
        } catch (err) {
            user.value = null
            isAuthenticated.value = false
        }
    }


    async function login(credentials) {
        try {
            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.post('/api/login', credentials)
            user.value = data;
            isAuthenticated.value = true;
        } catch (err) {
            user.value = null;
            isAuthenticated.value = false;
            if (err.response?.status == '401') {
                error.value = err.response.data.error.message;
            }
            else {
                error.value = 'Ocorreu um erro desconhecido.';
            }
        }
    }

    async function logout() {
        await axios.post('/api/logout')
            .then(() => {
                user.value = null
                isAuthenticated.value = false
                 router.push({ name: 'login' })
            })
       

    }

    async function checkAuthOnInit() {
        try {
            await getProfile()
        } catch {
            user.value = null
            isAuthenticated.value = false
        }
    }

    return {
        user,
        isAuthenticated,
        error,
        userComputed,
        login,
        getProfile,
        checkAuthOnInit,
        logout
    }
})
