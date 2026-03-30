<template>
  <EntityTable
    ref="entityTableRef"
    title="Gestión de Roles"
    entityName="Rol"
    :data="roles"
    :columns="columns"
    v-model:filters="filters"
    :globalSearchFields="['name']"
    :newItemFactory="createEmptyRole"
    :editItemMapper="mapRoleForEdit"
    @save="guardarRol"
    @delete="eliminarRol"
    :loading="isSaving"
  >
    <template #col-permissions="{ data }">
      <div class="flex flex-wrap gap-2">
        <Tag
          v-for="permiso in data.permissions"
          :key="permiso.id"
          severity="info"
          rounded
        >
          {{ permiso.name }}
        </Tag>

        <span v-if="!data.permissions?.length" class="text-gray-500 italic text-sm">
          Sin permisos
        </span>
      </div>
    </template>

    <template #form-fields="{ formData }">
      <div class="flex flex-col gap-4">
        <div>
          <label class="font-bold block mb-2">
            Nombre del rol <span class="text-red-500">*</span>
          </label>
          <InputText v-model="formData.name" class="w-full" required />
        </div>

        <div>
          <label class="font-bold block mb-2">Permisos</label>

          <div v-if="permisos.length" class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="permiso in permisos"
              :key="permiso.id"
              class="flex items-center gap-2"
            >
              <Checkbox
                v-model="formData.permissions"
                :inputId="`permiso-${permiso.id}`"
                name="permissions"
                :value="permiso.name"
              />
              <label :for="`permiso-${permiso.id}`">
                {{ permiso.name }}
              </label>
            </div>
          </div>

          <p v-else class="text-gray-500 italic text-sm">
            No hay permisos cargados.
          </p>
        </div>
      </div>
    </template>
  </EntityTable>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

import EntityTable from '@/components/common/EntityTable.vue';
import rolService from '@/services/rolService';
import permisoService from '@/services/permisoService';
import { useErrorStore } from '@/store/useError';

const toast = useToast();
const errorStore = useErrorStore();
const entityTableRef = ref(null);

const roles = ref([]);
const permisos = ref([]);
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
  }
});

const columns = ref([
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Rol' },
  { field: 'permissions', header: 'Permisos', sortable: false, filterable: false },
]);

const createEmptyRole = () => ({
  name: '',
  permissions: []
});

const mapRoleForEdit = (role) => ({
  ...role,
  permissions: role.permissions ? role.permissions.map((p) => p.name) : []
});

onMounted(() => {
  funListarRoles();
  funListarPermisos();
});

const formatearFecha = (fecha) => {
  if (!fecha) return '-';

  const date = new Date(fecha);

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const funListarRoles = async () => {
  try {
    const { data } = await rolService.funListarRoles();
    roles.value = data;
  } catch (error) {
    console.error('Error al cargar roles:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los roles',
      life: 3000
    });
  }
};

const funListarPermisos = async () => {
  try {
    const { data } = await permisoService.funListarPermisos();
    permisos.value = data.data;
  } catch (error) {
    console.error('Error al cargar permisos:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los permisos',
      life: 3000
    });
  }
};

const guardarRol = async (formDataEvent) => {
  isSaving.value = true;
  errorStore.clearErrors();

  const payload = {
    ...formDataEvent,
    permissions: [...(formDataEvent.permissions || [])]
  };

  try {
    if (payload.id) {
      await rolService.funModificar(payload.id, payload);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol actualizado correctamente',
        life: 3000
      });
    } else {
      await rolService.funGuardar(payload);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol creado correctamente',
        life: 3000
      });
    }

    await funListarRoles();
    entityTableRef.value.closeModal();
  } catch (error) {
    errorStore.handleError(error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Revisa los campos marcados en rojo',
      life: 3500
    });
  } finally {
    isSaving.value = false;
  }
};

const eliminarRol = async (idRol) => {
  try {
    await rolService.funEliminar(idRol);
    await funListarRoles();
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Rol eliminado correctamente',
      life: 3000
    });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo eliminar el rol',
      life: 3000
    });
  }
};
</script>