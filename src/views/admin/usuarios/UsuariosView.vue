<template>
    <div class="card mt-6">
        <h5>Prime Vue</h5>
        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
        <Column field="id" header="id" />
        <Column field="name" header="Nombre" />
        <Column field="email" header="Correo" />
        <Column field="ci" header="CI" />
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import usuarioService from '@/services/usuarioService';

const usuarios = ref([])

onMounted(() => {
    funListarUsuarios()
})

const funListarUsuarios = async () => {
    try {
        const { data } = await usuarioService.getUsuarios()
        usuarios.value = data
        console.log(usuarios);
        
    } catch (error) {
        console.log(error.response)
    }
    
}

</script>