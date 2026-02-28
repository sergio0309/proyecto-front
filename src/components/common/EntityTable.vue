<template>
  <div class="card">
    <Toolbar class="mb-6">
      <template #start>
        <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openNew" />
      </template>
      <template #end>
        <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
      </template>
    </Toolbar>

    <DataTable 
      ref="dt"
      :value="data" 
      v-model:filters="internalFilters" 
      filterDisplay="menu"
      dataKey="id"
      :globalFilterFields="globalSearchFields"
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :currentPageReportTemplate="`Mostrando {first} a {last} de {totalRecords} ${entityName.toLowerCase()}s`"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">{{ title }}</h4>
          <IconField>
            <InputIcon><i class="pi pi-search" /></InputIcon>
            <InputText v-model="internalFilters['global'].value" placeholder="Búsqueda general..." />
          </IconField>
        </div>
      </template>

      <Column 
        v-for="col in columns" 
        :key="col.field" 
        :field="col.field" 
        :header="col.header" 
        :sortable="col.sortable !== false"
        :dataType="col.dataType || 'text'"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <slot v-if="$slots[`col-${col.field}`]" :name="`col-${col.field}`" :data="data"></slot>
          <span v-else>{{ data[col.field] }}</span>
        </template>

        <template #filter="{ filterModel, filterCallback }" v-if="col.filterable !== false">
          <slot v-if="$slots[`filter-${col.field}`]" :name="`filter-${col.field}`" :filterModel="filterModel" :filterCallback="filterCallback"></slot>
          <InputText v-else v-model="filterModel.value" placeholder="Buscar por columna..." />
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 8rem" header="Acciones">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editItem(data)" />
          <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDelete(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="itemDialog" :header="currentItem.id ? `Editar ${entityName}` : `Nuevo ${entityName}`" :modal="true" style="width: 450px">
      <div class="flex flex-col gap-4 mt-4">
        <slot name="form-fields" :formData="currentItem"></slot>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="itemDialog = false" />
        <Button label="Guardar" icon="pi pi-check" @click="saveItem" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmar Acción" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl! text-red-500" />
        <span>¿Estás seguro de que deseas eliminar este <b>{{ entityName.toLowerCase() }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No, cancelar" icon="pi pi-times" text @click="deleteDialog = false" severity="secondary" />
        <Button label="Sí, eliminar" icon="pi pi-check" @click="executeDelete" severity="danger" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Registros' },
  entityName: { type: String, default: 'Registro' },
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  filters: { type: Object, required: true },
  globalSearchFields: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:filters', 'save', 'delete']);

const dt = ref();
const internalFilters = ref(props.filters);
watch(internalFilters, (newVal) => emit('update:filters', newVal), { deep: true });

// Estado para Crear/Editar
const itemDialog = ref(false);
const currentItem = ref({});

// Estado para Eliminar
const deleteDialog = ref(false);
const itemToDelete = ref(null);

const openNew = () => {
  currentItem.value = {};
  itemDialog.value = true;
};

const editItem = (item) => {
  currentItem.value = { ...item };
  itemDialog.value = true;
};

const saveItem = () => {
  emit('save', currentItem.value);
  itemDialog.value = false;
};

// Abre el modal de confirmación y guarda temporalmente qué ítem vamos a borrar
const confirmDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

// Emite el evento real de borrado y cierra el modal
const executeDelete = () => {
  if (itemToDelete.value) {
    emit('delete', itemToDelete.value.id);
  }
  deleteDialog.value = false;
  itemToDelete.value = null; // Limpiamos la memoria
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>