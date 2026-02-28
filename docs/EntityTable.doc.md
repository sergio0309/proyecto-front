# 🚀 EntityTable Component (Wrapper de PrimeVue)


## 📌 Propósito
`EntityTable` es un **Dumb Component** (Componente Presentacional) diseñado para estandarizar todos los CRUDs del panel de administración. 
Encapsula el diseño de `DataTable`, Paginación, Barra de Búsqueda y los Modales (Diálogos) de Creación/Edición y Eliminación de PrimeVue.

**Regla de Oro:** Este componente *NO sabe* qué es un Paciente, una Orden o un Producto. Toda la lógica de negocio y las llamadas a la API deben manejarse en la vista padre que lo invoca.

---

## ⚙️ Props (Lo que recibe)

### 📌 Props

---

📦 Props del componente BaseDataTable
1. data (requerido)

    Tipo: Array<Record<string, any>>

    Descripción: Lista de registros que se renderizan en la tabla.

    Cada objeto representa una fila.

2. columns (requerido)

    Tipo: Array<ColumnConfig>

    Descripción: Define cómo se renderiza cada columna.

    Ejemplo:

    [
    { field: 'name', header: 'Nombre' },
    { field: 'email', header: 'Correo' }
    ]
3. filters (requerido)

    Tipo: DataTableFilterMeta

    Descripción: Objeto reactivo usado por PrimeVue para manejar filtros.

    Se conecta con v-model:filters.

4. title (opcional)

    Tipo: string

    Default: ''

    Descripción: Título mostrado encima de la tabla.

    Ejemplo: "Gestión de Pacientes"

5. entityName (opcional)

    Tipo: string

    Default: 'Registro'

    Descripción: Nombre singular usado en modales y acciones.

    Ejemplo: "Paciente"

6. globalSearchFields (opcional)

    Tipo: string[]

    Default: []

    Descripción: Lista de campos donde aplica el buscador global.

    Ejemplo:

    ['name', 'email', 'dni']

🧩 Tipo auxiliar: ColumnConfig
    export interface ColumnConfig {
    field: string
    header: string
    sortable?: boolean
    style?: string
    }

    field → Propiedad del objeto data

    header → Texto del encabezado

    sortable → Permite ordenamiento

    style → Estilos inline opcionales

---

## 📡 Emits (Lo que avisa al padre)

| Evento | Payload (Lo que envía) | Cuándo se dispara |
| :--- | :--- | :--- |
| `@save` | `Object` (El ítem completo) | Al hacer clic en "Guardar" en el modal de Crear/Editar. |
| `@delete` | `Number/String` (El ID del ítem) | Al confirmar "Sí, eliminar" en el modal de peligro. |
| `@update:filters`| `Object` | Sincronización automática del v-model de filtros. |

---

## 🕳️ Slots (La Magia de la Inyección de UI)

El método Feynman para entender los Slots: Piensa en el componente como una placa base. Los slots son los "enchufes" donde conectas tarjetas gráficas (diseños personalizados). Si no conectas nada, usa los gráficos integrados (texto plano).

### 1. Inyectar el Formulario (`#form-fields`)
Obligatorio para que el modal de Crear/Editar tenga campos. Recibe el `formData` reactivo.
```html
<template #form-fields="{ formData }">
  <InputText v-model="formData.nombre" placeholder="Nombre" />
</template>