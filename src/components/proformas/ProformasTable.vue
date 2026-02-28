<template>
  <EntityTable
    title="Gestión de Proformas"
    entityName="Proforma"
    :data="pacientes"
    :columns="columnas"
    v-model:filters="filtros"
    :globalSearchFields="['nombre', 'documento', 'email']"
    @save="guardarPaciente"
    @delete="eliminarPaciente"
  >
    <!-- Columna Estado con Tag -->
    <template #col-estado="{ data }">
      <Tag :value="data.estado" :severity="obtenerColorEstado(data.estado)" />
    </template>

    <!-- Filtro personalizado para estado -->
    <template #filter-estado="{ filterModel }">
      <Select 
        v-model="filterModel.value" 
        :options="['Activo', 'Inactivo']" 
        placeholder="Seleccionar Estado" 
        class="w-full" 
      />
    </template>

    <!-- Formulario dinámico -->
    <template #form-fields="{ formData }">
      <div>
        <label class="block font-bold mb-2">Nombre Completo</label>
        <InputText v-model="formData.nombre" class="w-full" />
      </div>

      <div>
        <label class="block font-bold mb-2">Documento</label>
        <InputText v-model="formData.documento" class="w-full" />
      </div>

      <div>
        <label class="block font-bold mb-2">Email</label>
        <InputText v-model="formData.email" class="w-full" />
      </div>

      <div>
        <label class="block font-bold mb-2">Teléfono</label>
        <InputText v-model="formData.telefono" class="w-full" />
      </div>

      <div>
        <label class="block font-bold mb-2">Estado</label>
        <Select 
          v-model="formData.estado" 
          :options="['Activo', 'Inactivo']" 
          class="w-full" 
        />
      </div>
    </template>

  </EntityTable>
</template>

<script setup>
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import EntityTable from '@/components/common/EntityTable.vue';

// 1️⃣ Configuración de Columnas
const columnas = [
  { field: 'nombre', header: 'Nombre' },
  { field: 'documento', header: 'Documento' },
  { field: 'email', header: 'Email' },
  { field: 'telefono', header: 'Teléfono' },
  { field: 'estado', header: 'Estado' }
];

// 2️⃣ Filtros requeridos por PrimeVue
const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  documento: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  telefono: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  estado: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});

// 3️⃣ Datos simulados (MVP Sprint 1)
const pacientes = ref([
  { id: 1, nombre: 'Juan Pérez', documento: '12345678', email: 'juan@email.com', telefono: '987654321', estado: 'Activo' },
  { id: 2, nombre: 'María Gómez', documento: '87654321', email: 'maria@email.com', telefono: '912345678', estado: 'Activo' },
  { id: 3, nombre: 'Carlos Ruiz', documento: '45678912', email: 'carlos@email.com', telefono: '998877665', estado: 'Inactivo' },
  { id: 4, nombre: 'Ana Torres', documento: '11223344', email: 'ana@email.com', telefono: '944556677', estado: 'Activo' },
  { id: 5, nombre: 'Luis Martínez', documento: '55667788', email: 'luis@email.com', telefono: '977665544', estado: 'Inactivo' }
]);

// 4️⃣ Helpers UI
const obtenerColorEstado = (estado) => {
  switch (estado) {
    case 'Activo': return 'success';
    case 'Inactivo': return 'danger';
    default: return 'info';
  }
};

// 5️⃣ Lógica CRUD temporal (Sprint 1 modo local)
const guardarPaciente = (paciente) => {
  if (paciente.id) {
    const index = pacientes.value.findIndex(p => p.id === paciente.id);
    pacientes.value[index] = paciente;
    console.log('Paciente actualizado (mock API)', paciente);
  } else {
    paciente.id = Math.floor(Math.random() * 10000);
    pacientes.value.push(paciente);
    console.log('Paciente creado (mock API)', paciente);
  }
};

const eliminarPaciente = (id) => {
  pacientes.value = pacientes.value.filter(p => p.id !== id);
  console.log('Paciente eliminado (mock API)', id);
};
</script>