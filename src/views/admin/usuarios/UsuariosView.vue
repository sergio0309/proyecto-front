<template>
    <EntityTable
        ref="entityTableRef"
        title="Gestión de Usuarios"
        entityName="Usuario"
        :data="usuarios"
        :columns="columns"
        v-model:filters="filters"
        :globalSearchFields="['name', 'ci', 'email']"
        @save="guardarUsuario"
        @delete="eliminarUsuario"
        :loading="isSaving"
    >
        <template #col-img="{ data }">
            <Image
                v-if="data.img"
                :src="`${URL.replace('/api', '/users')}/${data.img}`" 
                :alt="data.name"
                class="border-circle"
                style="width: 64px; height: 64px; object-fit: cover"
                preview
            />
            <p v-else class="text-gray-500 italic text-sm">Sin imagen</p>
        </template>

        <template #form-fields="{ formData }">
            <div class="flex gap-4">
                <div class="flex-1">
                    <label class="font-bold">CI <span class="text-red-500">*</span></label>
                    <InputText v-model="formData.ci" class="w-full" required />
                </div>
                <div class="flex-1">
                    <label class="font-bold">Correo <span class="text-red-500">*</span></label>
                    <InputText v-model="formData.email" class="w-full" type="email" required />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-2">
                <div class="col-span-6">
                    <label class="font-bold">Nombre <span class="text-red-500">*</span></label>
                    <InputText v-model="formData.name" class="w-full" required />
                </div>
                <div class="col-span-3">
                    <label class="font-bold">Teléfono</label>
                    <InputText v-model="formData.phone" class="w-full" />
                </div>
                <div class="col-span-3">
                    <label class="font-bold">Nacimiento <span class="text-red-500">*</span></label>
                    <DatePicker 
                        v-model="formData.fecha_nacimiento" 
                        dateFormat="yy-mm-dd" 
                        dataType="string" 
                        class="w-full" 
                    />
                </div>
            </div>

            <div class="flex gap-4 mt-2">
                <div class="flex-1">
                    <label class="font-bold">Dirección</label>
                    <InputText v-model="formData.address" fluid />
                </div>
                <div class="flex-1">
                    <label class="font-bold">Contraseña</label>
                    <Password 
                        v-model="formData.password" 
                        toggleMask 
                        :promptLabel="formData.id ? 'Dejar en blanco para no cambiar' : 'Ingrese una contraseña'"
                        weakLabel="Débil" mediumLabel="Media" strongLabel="Fuerte"
                        fluid
                    />
                </div>
                <div class="flex-1">
                    <label class="font-bold">Foto Perfil</label>
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        :maxFileSize="2000000"
                        chooseLabel="Seleccionar"
                        @select="(event) => formData.archivoImagen = event.files[0]"
                        class="w-full"
                        :disabled="soloVer"
                    />
                </div>
            </div>

            <div class="flex flex-col gap-2 mt-2">
                <label class="font-bold">Roles</label>
                <MultiSelect
                    v-model="formData.roles"
                    :options="roles"
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Seleccione roles"
                    display="chip"
                    filter
                    class="w-full"
                    :disabled="soloVer"
                />
            </div>
        </template>
    </EntityTable>
</template>

<script setup>
import { URL } from '@/utils/httpClient'; 
import { onMounted, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import usuarioService from '@/services/usuarioService';
import rolService from '@/services/rolService';
import EntityTable from '@/components/common/EntityTable.vue';
import { useErrorStore } from '@/store/useError'; 
import { objectToFormData } from '@/utils/FormHelper';

const toast = useToast();
const errorStore = useErrorStore();
const entityTableRef = ref(null); // 🔵 El mando a distancia para la tabla

const usuarios = ref([]);
const roles = ref([]);
const isSaving = ref(false);
 
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  id: {
    operator: 'and',
    constraints: [{ value: null, matchMode: 'contains' }]
  },
  name: {
    operator: 'and',
    constraints: [{ value: null, matchMode: 'contains' }]
  },
  ci: {
    operator: 'and',
    constraints: [{ value: null, matchMode: 'contains' }]
  },
  email: {
    operator: 'and',
    constraints: [{ value: null, matchMode: 'contains' }]
  }
});

const columns = ref([
    { field: 'id', header: 'ID' },
    { field: 'img', header: 'IMAGEN', filterable: false  }, 
    { field: 'name', header: 'Nombre' },
    { field: 'ci', header: 'CI' },
    { field: 'email', header: 'Correo' }
]);

onMounted(() => {
    funListarUsuarios();
    funListarRoles();
});

const formatearFecha = (fecha) => {
    const date = new Date(fecha)

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const funListarUsuarios = async () => {
    try {
        const { data } = await usuarioService.funListarUsuarios();
        usuarios.value = data;
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 });
    }
};

const funListarRoles = async () => {
    try {
        const { data } = await rolService.funListarRoles();
        roles.value = data;
    } catch (error) {
        console.error("Error al cargar roles:", error);
    }
};

const guardarUsuario = async (formDataEvent) => {    
    isSaving.value = true;
    errorStore.clearErrors();

    // Clonamos para no romper la reactividad de la UI mientras se guarda
    const payload = { ...formDataEvent };

    // Si es un objeto Date, lo forzamos a YYYY-MM-DD
    if (payload.fecha_nacimiento instanceof Date) {
        const d = payload.fecha_nacimiento;
        // Usamos este formato para evitar líos de zona horaria (UTC vs Local)
        payload.fecha_nacimiento = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    
    // Usamos el helper. Si tiene ID, es PUT (Actualizar), sino es POST (Crear)
    const method = formDataEvent.id ? 'PUT' : null;
    const form = objectToFormData(payload, method);

    try {
        if (formDataEvent.id) {
            await usuarioService.funActualizar(formDataEvent.id, form);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
        } else {
            await usuarioService.funGuardar(form);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
        }
        
        funListarUsuarios(); // Refrescamos los datos
        entityTableRef.value.closeModal(); //(cerramos el modal)

    } catch (error) {
        // 🔵 Si hay error (ej. 422 Validación), el modal NO se cierra.
        // Solo mandamos el error a Pinia y el componente ErrorSection lo mostrará.
        errorStore.handleError(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Revisa los campos marcados en rojo', life: 3500 });
    } finally {
        isSaving.value = false;
    }
};

const eliminarUsuario = async (idUsuario) => {
    try {
        await usuarioService.funEliminar(idUsuario); 
        funListarUsuarios();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al eliminar", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
    }
};
</script>