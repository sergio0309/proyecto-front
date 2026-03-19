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
        <Column header="Fecha Nacimiento">
            <template #body="slotProps">
                {{ formatearFecha(slotProps.data.fecha_nacimiento) }}
            </template>
        </Column>
        <Column field="address" header="Direccion" />
        <Column header="Acciones" :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-eye" severity="info" variant="outlined" rounded class="mr-2" @click="verUsuario(slotProps.data)" />
                <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editarUsuario(slotProps.data)" />
                <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmarEliminacionRol(slotProps.data)" />
            </template>
        </Column>

        </DataTable>
    </div>

    <Dialog v-model:visible="visibleUsuario" :style="{ width: '700px' }" :header="soloVer ? 'VER USUARIO' : 'USUARIO'">

        <div class="flex flex-col gap-4">
            <div class="flex gap-4">

                <div class="flex-1">
                    <label class="font-bold">CI</label>
                    <InputText v-model="usuario.ci" class="w-full" :disabled="soloVer"/>
                </div>

                <div class="flex-1">
                    <label class="font-bold">Correo</label>
                    <InputText v-model="usuario.email" class="w-full" :disabled="soloVer"/>
                </div>

            </div>

            <div class="grid grid-cols-12 gap-4">

                <div class="col-span-6">
                    <label class="font-bold">Nombre</label>
                    <InputText v-model="usuario.name" class="w-full" :disabled="soloVer"/>
                </div>

                <div class="col-span-3">
                    <label class="font-bold">Telefono</label>
                    <InputText v-model="usuario.phone" class="w-full" :disabled="soloVer"/>
                </div>

                <div class="col-span-3">
                    <label class="font-bold">Fecha de Nacimiento</label>
                    <DatePicker
                        v-model="usuario.fecha_nacimiento"
                        dateFormat="dd/mm/yy"
                        class="w-full"
                        :disabled="soloVer"
                    />
                </div>

            </div>

            <div class="flex gap-4">
                <div class="flex-1">
                    <label class="font-bold">Dirección</label>
                    <InputText v-model="usuario.address" fluid :disabled="soloVer"/>
                </div>

                <div class="flex-1" v-if="!soloVer">
                    <label class="font-bold">Contraseña</label>
                    <Password v-model="usuario.password" 
                    toggleMask 
                    promptLabel="Ingrese una contraseña"
                    weakLabel="Débil"
                    mediumLabel="Media"
                    strongLabel="Fuerte"
                    fluid
                    :disabled="soloVer"
                    />
                </div>

                <div class="flex-1" v-if="!soloVer">
                    <label class="font-bold">Foto Perfil</label>

                    <FileUpload
                        customUpload
                        @uploader="SubirImagenProducto($event)"
                        :multiple="false"
                        accept="image/*"
                        :maxFileSize="1000000"
                        mode="basic"
                        chooseLabel="Seleccionar Imagen"
                        class="w-full"
                        :disabled="soloVer"
                    />
                </div>
            </div>


            <div class="flex flex-col gap-2">
                <label class="font-bold">Roles</label>

                <MultiSelect
                    v-model="usuario.roles"
                    :options="roles"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Seleccione roles"
                    display="chip"
                    filter
                    class="w-full"
                    :disabled="soloVer"
                />
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="visibleUsuario=false" />
            <Button label="Guardar" icon="pi pi-check" @click="funGuardar()" />
        </template>

    </Dialog>


</template>

<script setup>
import { BASE_URL } from '@/services/apiService'
import { onMounted, ref } from 'vue';
import usuarioService from '@/services/usuarioService';
import rolService from '@/services/rolService';

const usuarios = ref([])
const usuario = ref({})
const roles = ref([])
const rolesSeleccionados = ref([])
const visibleUsuario = ref(false)
const soloVer = ref(false)

onMounted(() => {
    funListarUsuarios()
    funListarRoles()
})

const formatearFecha = (fecha) => {
    const date = new Date(fecha)

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const funListarUsuarios = async () => {
    const { data } = await usuarioService.funListarUsuarios()
    usuarios.value = data
}

const funListarRoles = async () => {
    const { data } = await rolService.funListarRoles()
    roles.value = data
}

const funNuevoUsuario = () => {
    usuario.value = {}
    soloVer.value = false
    visibleUsuario.value = true
}


const verUsuario = (user) => {

    usuario.value = {
        ...user,
        fecha_nacimiento: user.fecha_nacimiento ? new Date(user.fecha_nacimiento) : null,
        roles: user.roles ? user.roles.map(r => r.id): []
    }

    visibleUsuario.value = true

    soloVer.value = true
}

const editarUsuario = (user) => {
    usuario.value = {
        ...user,
        fecha_nacimiento: user.fecha_nacimiento ? new Date(user.fecha_nacimiento) : null,
        roles: user.roles ? user.roles.map(r => r.id): []
    }

    soloVer.value = false

    visibleUsuario.value = true
}

const funGuardar = async () => {
    
    const { data } = await usuarioService.funGuardar(usuario.value)
    visibleUsuario.value = false
    funListarUsuarios()
}

</script>