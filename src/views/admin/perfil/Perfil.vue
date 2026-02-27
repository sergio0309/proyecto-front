<template>
    <div class="card">
        <div class="pt-12 pb-8">
            <button class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-full" @click="funSalir()">
                Cerrar Sesion
            </button> 
        </div>
    </div>
</template>

<script setup>

import router from '../../../router';
import AuthService from '@/services/AuthService';


const funSalir = async () => {
    await AuthService.logout()
    localStorage.removeItem("access_token")
    router.push({name: 'Login'})

}

</script>