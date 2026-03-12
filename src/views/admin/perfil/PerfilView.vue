<template>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <ProfileCard />
      <PersonalInfoCard />
      <AddressCard />
      <div class="pt-12 pb-8">
          <button class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-full" @click="funSalir()">
          Cerrar Sesion
          </button> 
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ProfileCard from '../../../components/perfil/ProfileCard.vue'
import PersonalInfoCard from '../../../components/perfil/PersonalInfoCard.vue'
import AddressCard from '../../../components/perfil/AddressCard.vue'
import authService from '../../../services/authService'
const currentPageTitle = ref('User Profile')

const funSalir = async () => {
  await authService.logout()
  localStorage.removeItem('token');
  router.push({name: 'Login'})
}
</script>
