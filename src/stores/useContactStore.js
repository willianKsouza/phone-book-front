import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'

export const useContactStore = defineStore('contact', () => {
    const contacts = ref([])
    const isLoadingContacts = ref(true)
    const error = ref(null)

    async function getContacts() {
        error.value = null
        try {
            await axios.get('/api/contacts')
                .then(({ data }) => {
                    contacts.value = data.data
                    isLoadingContacts.value = false
                })
        } catch (err) {
            if (err.response?.status == '401') {
                error.value = err.response.data.error.message;
            }
            else {
                error.value = 'Ocorreu um erro desconhecido.';
            }
        }
    }

    async function createContact(formData) {
        error.value = null
        try {
            const response = await axios.post('/api/contacts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log(response);

            if (response.status === 201) {
                contacts.value.unshift(response.data)
            }
        } catch (err) {

            if (err.response?.status == '401') {
                error.value = err.response.data.error.message;
            }
            else {
                error.value = 'Ocorreu um erro desconhecido.';
            }
        }
    }

    async function updateContact(data) {
        error.value = null
        

        try {
            const response = await axios.patch(`/api/contacts/${data.id}`, data)
            console.log(response);

            if (response.statusText == '200') {
                const index = contacts.value.findIndex(c => c.id === data.id)
                if (index !== -1) {
                    contacts.value[index] = { ...response.data }
                }
                console.log(contacts.value);
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function deleteContact(contactId) {
        error.value = null
        try {
            await axios.delete(`/api/contacts/${contactId}`)
            contacts.value = contacts.value.filter(c => c.id !== contactId)
        } catch (err) {
            console.log(err);

        }
    }

    async function updateAvatar(contactId, formData) {
        error.value = null;
        try {
            const response = await axios.post(
                `/api/contacts/${contactId}/avatar`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const newAvatarPath = response.data;
            contacts.value = contacts.value.map(contact => {
                if (contact.id === contactId) {
                    return { ...contact, avatar: newAvatarPath };
                }
                return contact;
            });

        } catch (err) {
            return
        }
    }

    return {
        contacts,
        isLoadingContacts,
        getContacts,
        createContact,
        updateContact,
        deleteContact,
        updateAvatar
    }
})
