<script setup>
import { ref } from 'vue'
import CardContact from './CardContact.vue'
import { Grip } from 'lucide-vue-next'
import CreateContact from './CreateContactButton.vue'
import { useContactStore } from '@/stores/useContactStore'
import ContactSkeleton from './ContactSkeleton.vue'
import ContactProfileModal from './modals/ContactProfileModal.vue'

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
    <div class="grid grid-cols-2 xs:grid-cols-3 gap-4 justify-between md:grid-cols-4">
      <div class="">Name ({{ contactsStore.contactsComputed.length }})</div>
      <div class="hidden xs:block">Phone</div>
      <div class="hidden md:block">Email</div>
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
    <CreateContact class="ml-auto" />
    <Teleport to="body">
        <ContactProfileModal 
            v-if="showContactProfileModal"
            :contact="contactProfileData"
            @close-modal="showContactProfileModal = false"
        />
    </Teleport>
  </section>
</template>
