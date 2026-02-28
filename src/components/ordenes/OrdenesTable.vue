<template>
  <EntityTable
    title="Gestión de Órdenes"
    entityName="Orden"
    :data="ordenes"
    :columns="columnas"
    v-model:filters="filtros"
    :globalSearchFields="['cliente', 'codigo']"
    @save="guardarOrden"
    @delete="eliminarOrden"
  >
    <template #col-total="{ data }">
      <span class="font-bold text-green-600">
        {{ formatearMoneda(data.total) }}
      </span>
    </template>

    <template #col-estado="{ data }">
      <Tag :value="data.estado" :severity="obtenerColorEstado(data.estado)" />
    </template>

    <template #filter-estado="{ filterModel }">
      <Select 
        v-model="filterModel.value" 
        :options="['Pendiente', 'Pagado', 'Cancelado']" 
        placeholder="Seleccionar Estado" 
        class="w-full" 
      />
    </template>

    <template #form-fields="{ formData }">
      <div>
        <label class="block font-bold mb-2">Código de Orden</label>
        <InputText v-model="formData.codigo" class="w-full" />
      </div>
      <div>
        <label class="block font-bold mb-2">Cliente</label>
        <InputText v-model="formData.cliente" class="w-full" />
      </div>
      <div>
        <label class="block font-bold mb-2">Total ($)</label>
        <InputNumber v-model="formData.total" mode="currency" currency="USD" class="w-full" />
      </div>
      <div>
        <label class="block font-bold mb-2">Estado</label>
        <Select v-model="formData.estado" :options="['Pendiente', 'Pagado', 'Cancelado']" class="w-full" />
      </div>
    </template>

  </EntityTable>
</template>

<script setup>
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import EntityTable from '@/components/common/EntityTable.vue';

// 1. Configuración de Columnas
const columnas = [
  { field: 'codigo', header: 'Código' },
  { field: 'cliente', header: 'Cliente' },
  { field: 'total', header: 'Monto Total', dataType: 'numeric' },
  { field: 'estado', header: 'Estado' }
];

// 2. Estado de Filtros (Requerido por PrimeVue)
const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  codigo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  cliente: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  estado: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});

// 3. Datos Simulados (Aquí harías un fetch a tu API)
const ordenes = ref([
  { id: 1, codigo: 'ORD-001', cliente: 'Juan Perez', total: 1500, estado: 'Pagado' },
  { id: 2, codigo: 'ORD-002', cliente: 'Maria Gomez', total: 320.50, estado: 'Pendiente' },
  { id: 3, codigo: 'ORD-003', cliente: 'Tech Corp', total: 8500, estado: 'Cancelado' },
  { id: 4, codigo: 'ORD-004', cliente: 'Ana Martinez', total: 450.75, estado: 'Pagado' },
  { id: 5, codigo: 'ORD-005', cliente: 'Carlos Ruiz', total: 1200, estado: 'Pendiente' },
  { id: 6, codigo: 'ORD-006', cliente: 'Sofia Lopez', total: 2300, estado: 'Pagado' },
  { id: 7, codigo: 'ORD-007', cliente: 'Global Inc', total: 9800, estado: 'Cancelado' },
  { id: 8, codigo: 'ORD-008', cliente: 'Luis Fernandez', total: 670.25, estado: 'Pendiente' },
  { id: 9, codigo: 'ORD-009', cliente: 'Marta Sanchez', total: 5400, estado: 'Pagado' },
  { id: 10, codigo: 'ORD-010', cliente: 'Eduardo Diaz', total: 300.50, estado: 'Pendiente' },
  { id: 11, codigo: 'ORD-011', cliente: 'Isabel Torres', total: 4100, estado: 'Pagado' },
  { id: 12, codigo: 'ORD-012', cliente: 'Fernando Ramirez', total: 750.75, estado: 'Cancelado' },
  { id: 13, codigo: 'ORD-013', cliente: 'Laura Castro', total: 2200, estado: 'Pendiente' },
  { id: 14, codigo: 'ORD-014', cliente: 'Diego Morales', total: 1300, estado: 'Pagado' },
  { id: 15, codigo: 'ORD-015', cliente: 'Sergio Herrera', total: 890.50, estado: 'Pendiente' }
]);

// 4. Utilidades de Formato
const formatearMoneda = (valor) => {
  return valor ? valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
};

const obtenerColorEstado = (estado) => {
  switch (estado) {
    case 'Pagado': return 'success';
    case 'Pendiente': return 'warn';
    case 'Cancelado': return 'danger';
    default: return 'info';
  }
};

// 5. Lógica de Guardado y Eliminado (Eventos emitidos por EntityTable)
const guardarOrden = (orden) => {
  if (orden.id) {
    // Es una edición: Buscamos el index y actualizamos
    const index = ordenes.value.findIndex(o => o.id === orden.id);
    ordenes.value[index] = orden;
    console.log('Orden actualizada vía API', orden);
  } else {
    // Es nuevo: Generamos ID temporal y metemos al array
    orden.id = Math.floor(Math.random() * 10000);
    ordenes.value.push(orden);
    console.log('Orden creada vía API', orden);
  }
};

const eliminarOrden = (id) => {
  ordenes.value = ordenes.value.filter(o => o.id !== id);
  console.log('Orden eliminada vía API', id);
};
</script>