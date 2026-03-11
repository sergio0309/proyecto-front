<template>
    <div class="card mt-6">
        
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Crear Rol" icon="pi pi-plus" class="mr-2" @click="funNuevoRol()" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>
        

        <DataTable :value="roles" tableStyle="min-width: 50rem">

            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gestión de Roles</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column field="id" header="id" />
            <Column field="name" header="Rol" />
            <Column header="Creado en">
                <template #body="slotProps">
                    {{ formatearFecha(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column header="Acciones" :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" severity="info" variant="outlined" rounded class="mr-2" @click="verRol(slotProps.data)" />
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editarRol(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmarEliminacionRol(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleRol" :style="{ width: '600px' }" :header="soloVer ? 'VER ROL' : 'ROL'">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Nombre Rol</label>
                <InputText 
                    v-model="role.name" 
                    id="name" required 
                    autofocus fluid 
                    :disabled="soloVer"
                />
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Permisos</label>
                
                <div class="grid grid-cols-3 gap-3">
                    <div class="flex items-center gap-2" v-for="permiso in permisos" :key="permiso.id">
                        <Checkbox 
                            v-model="permisosSeleccionados" 
                            :inputId="'permiso' + permiso.id" 
                            name="permiso" 
                            :value="permiso.name"
                            :disabled="soloVer"
                        />
                        <label :for="'permiso' + permiso.id"> {{ permiso.name }} </label>
                    </div>
                </div>

            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="funGuardar()" v-if="!soloVer"/>
        </template>
    </Dialog>

    <Dialog v-model:visible="visibleDelete" modal header="Eliminar Rol" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">¿Esta Seguro de Elimnar el Rol?</span>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleDelete = false"></Button>
            <Button type="button" label="Eliminar" severity="danger" @click="eliminarRol()"></Button>
        </div>
    </Dialog>


</template>

<script setup>
import { onMounted, ref } from 'vue';
import rolService from '@/services/rolService';
import permisoService from '@/services/permisoService';
import Swal from 'sweetalert2'

const role = ref({})
const roles = ref([])
const permisos = ref([])
const permisosSeleccionados = ref([])
const visibleRol = ref(false)
const visibleDelete = ref(false)
const soloVer = ref(false) 

onMounted(() => {
    funListarRoles()
    funListarPermisos()
})

const formatearFecha = (fecha) => {
    const date = new Date(fecha)

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const funListarRoles = async () => {
    const { data } = await rolService.funListarRoles()
    roles.value = data
}

const funListarPermisos = async () => {
    const { data } = await permisoService.funListarPermisos()
    permisos.value = data.data
}

const funNuevoRol = () => {
    role.value = {}
    permisosSeleccionados.value = []
    visibleRol.value = true
}

const hideDialog = () => {
    visibleRol.value = false
}

const verRol = (rol) => {

    role.value = rol 

    permisosSeleccionados.value = rol.permissions.map(p => p.name)

    soloVer.value = true
    visibleRol.value = true

}

const editarRol = (rol) => {

    role.value = rol

    permisosSeleccionados.value = rol.permissions.map(p => p.name)

    soloVer.value = false
    visibleRol.value = true
}

const confirmarEliminacionRol = (rol) => {
    
    role.value = rol

    visibleDelete.value = true
}

const funGuardar = async () => {

    try {
        if(role.value.id){
            role.value.permissions = permisosSeleccionados.value
            const { data } = await rolService.funModificar(role.value.id, role.value)
            visibleRol.value = false
            funListarRoles()
            Swal.fire({
                title: "Rol actualizado!",
                text: "Confirme para continuar!",
                icon: "info"
            });
        }
        else {
            role.value.permissions = permisosSeleccionados.value
            const { data } = await rolService.funGuardar(role.value)
            visibleRol.value = false
            funListarRoles()
            Swal.fire({
                title: "Rol registrado!",
                text: "Confirme para continuar!",
                icon: "success"
            });

        }
    } catch (error) {
        Swal.fire({
            title: "Problemas al registrar!",
            text: "Ocurrió un error al guardar el rol",
            icon: "error"
        });
    }

}

const eliminarRol = async () => {

    try {
        const { data } = await rolService.funEliminar(role.value.id);
        visibleDelete.value = false
        funListarRoles()
        Swal.fire({
            title: "Rol eliminado",
            text: "El rol fue eliminado correctamente",
            icon: "success"
        });
        
    } catch (error) {
        Swal.fire({
            title: "Problemas al eliminar!",
            text: "Ocurrió un error al borrar el rol",
            icon: "error"
        });
    }
}

</script>