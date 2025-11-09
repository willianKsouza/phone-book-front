import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
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
        await axios.post('/logout')
        user.value = null
        isAuthenticated.value = false
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
        login,
        getProfile,
        checkAuthOnInit,
        logout
    }
})
