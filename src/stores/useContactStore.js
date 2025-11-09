import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/api/axios'
import { computed } from 'vue'

export const useContactStore = defineStore('contact', () => {
    const searchQuery = ref('')
    const contacts = ref([])
    const contactsComputed = computed(() => contacts.value)
    const isLoadingContacts = ref(true)
    const error = ref(null)
    const validationErrosApi = ref(null)

    function setValidationErrors(errorsArray) {
        const errors = {}
        errorsArray.forEach(err => {
            errors[err.field] = err.message
        })
        validationErrosApi.value = errors
    }

    async function getContacts(query, field) {
        try {
            await axios.get('/api/contacts',
                {
                    params: {
                        field: field,
                        value: query,
                        page: 1,
                        per_page: 15
                    }
                }
            )
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

            if (response.status === 201) {
                contacts.value.unshift(response.data)
            }
        } catch (err) {

            if (err.response?.status == '422') {
                setValidationErrors(err.response.data.error.validation_errors)
            }

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
            await axios.patch(`/api/contacts/${data.id}`, data)
                .then(({ data }) => {
                    const index = contacts.value.findIndex(c => c.id === data.id)
                    if (index !== -1) {
                        contacts.value.splice(index, 1)
                        contacts.value.unshift(data)
                    }
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

    async function deleteContact(contactId) {
        try {
            await axios.delete(`/api/contacts/${contactId}`)
                .then(() => {
                    const index = contacts.value.findIndex(c => c.id === contactId)
                    if (index !== -1) {
                        contacts.value.splice(index, 1)
                    }
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
            if (err.response?.status == '401') {
                error.value = err.response.data.error.message;
            }
            else {
                error.value = 'Ocorreu um erro desconhecido.';
            }
        }
    }

    return {
        contactsComputed,
        isLoadingContacts,
        validationErrosApi,
        searchQuery,
        getContacts,
        createContact,
        updateContact,
        deleteContact,
        updateAvatar
    }
})
