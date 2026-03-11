<template>
    <div class="card mt-6">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Crear Usuario" icon="pi pi-plus" class="mr-2" @click="funNuevoUsuario()" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>


        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
            
        <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Gestión de Usuarios</h4>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Buscar..." />
                </IconField>
            </div>
        </template>

        <Column field="id" header="id" />
        <Column header="IMAGEN">
            <template #body="slotProps">
                <Image
                    v-if="slotProps.data.img"
                    :src="`${BASE_URL}/${slotProps.data.img}`"
                    :alt="slotProps.data.nombre"
                    class="border-circle"
                    style="width: 64px; height: 64px; object-fit: cover"
                    preview
                />
                <p v-else class="text-gray-500 italic text-sm">
                    No hay imagen disponible
                </p>
            </template>
        </Column>
        <Column field="name" header="Nombre" />
        <Column field="ci" header="CI" />
        <Column field="email" header="Correo" />
        <Column field="phone" header="Telefono" />
        <Column field="address" header="Direccion" />
        <Column header="Acciones" :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-eye" severity="info" variant="outlined" rounded class="mr-2" @click="verRol(slotProps.data)" />
                <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editarRol(slotProps.data)" />
                <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmarEliminacionRol(slotProps.data)" />
            </template>
        </Column>

        </DataTable>
    </div>

    <Dialog v-model:visible="visibleUsuario" :style="{ width: '600px' }" header="USUARIO">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Nombre Rol</label>
                <!-- <InputText 
                    v-model="role.name" 
                    id="name" required 
                    autofocus fluid 
                    :disabled="soloVer"
                /> -->
            </div>
            
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="visibleUsuario = false" />
            <Button label="Guardar" icon="pi pi-check" @click="funGuardar()" v-if="!soloVer"/>
        </template>
    </Dialog>


</template>

<script setup>
import { BASE_URL } from '@/services/apiService'
import { onMounted, ref } from 'vue';
import usuarioService from '@/services/usuarioService';

const usuarios = ref([])
const visibleUsuario = ref(false)

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

const funNuevoUsuario = () => {
    visibleUsuario.value = true
}

</script>