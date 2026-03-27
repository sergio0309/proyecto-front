<template>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <ProfileCard />
      <PersonalInfoCard />
      <div class="pt-12 pb-8">
          <Button 
            label="Cerrar Sesión" 
            icon="pi pi-sign-out" 
            severity="danger" 
            @click="modalVisible = true" 
          />

          <Dialog 
            v-model:visible="modalVisible" 
            modal 
            header="Finalizar Sesión" 
            :style="{ width: '25rem' }"
            :draggable="false"
          >
            <div class="flex flex-col gap-6">
              <p class="text-slate-400">
                ¿Estás seguro que quieres salir? Se cerrarán todos los procesos activos de la clínica.
              </p>
              
              <div class="flex justify-end gap-3">
                <Button label="Cancelar" text @click="modalVisible = false" />
                
                <Button 
                  label="Cerrar Sesión" 
                  severity="danger" 
                  @click="confirmarSalida" 
                />
              </div>
            </div>
          </Dialog>
      </div>
    </div>
</template>

<script setup>
import ProfileCard from '../../../components/perfil/ProfileCard.vue'
import PersonalInfoCard from '../../../components/perfil/PersonalInfoCard.vue'
import AddressCard from '../../../components/perfil/AddressCard.vue'
import { useAuthStore } from '../../../store/useAuth'
import router from '../../../router'
import Dialog from 'primevue/dialog';
import { ref } from 'vue'

const authStore = useAuthStore()
const modalVisible = ref(false)
const confirmarSalida = async () => {
  await authStore.logout()
  if (!authStore.user) {
    router.push({name: 'Login'})
  }
}
</script>
