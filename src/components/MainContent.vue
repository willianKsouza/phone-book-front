<script setup>
import { ref } from 'vue'
import CardContact from '@/components/CardContact.vue'
import { Grip } from 'lucide-vue-next'
import { useContactStore } from '../stores/useContactStore'
import ContactSkeleton from '@/components/ContactSkeleton.vue'
import ContactProfileModal from '@/components/modals/ContactProfileModal.vue'
import CreateContactButton from './CreateContactButton.vue'

const contactsStore = useContactStore()
const contactProfileData = ref(null)

const showContactProfileModal = ref(false)

const openContactProfileModal = (contact) => {
  showContactProfileModal.value = true
  contactProfileData.value = contact
}

</script>
<template>
  <section>
    <div class="grid grid-cols-2 xs:grid-cols-3 gap-x-4 justify-between md:grid-cols-4 border-b pb-2 border-secondary">
      <div class="text-primary font-semibold">Name ({{ contactsStore.contactsComputed.length }})</div>
      <div class="text-primary font-semibold hidden xs:block">Phone</div>
      <div class="text-primary font-semibold hidden md:block">Email</div>
      <div class="justify-self-end text-secondary mr-2">
        <Grip />
      </div>
    </div>
    <div class="mt-1">
      <div v-if="contactsStore.isLoadingContacts">
        <ContactSkeleton
          v-for="n in 5"
          :key="n"
        />
      </div>
      <CardContact
        v-else
        v-for="contact in contactsStore.contactsComputed"
        :name="contact.name"
        :phone="contact.phone"
        :email="contact.email"
        :avatar="contact.avatar"
        :key="contact.id"
        @click="openContactProfileModal(contact)"
      />
    </div>
    <CreateContactButton class="ml-auto" />
    <Teleport to="body">
        <ContactProfileModal 
            v-if="showContactProfileModal"
            :contact="contactProfileData"
            @close-modal="showContactProfileModal = false"
        />
    </Teleport>
  </section>
</template>
