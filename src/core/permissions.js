/**
 * Set de Permisos del sistema Issy clínica.
 * Si mañana cambia el naming de los permisos(del backend) o aumentan más modulos,
 * acá es el único lugar que hay que actualizar, y el resto del código (ej: en RolesTable.vue) se mantiene intacto
 */
export const PERMISSIONS = {
  VIEW_USER: "ver usuarios",
  CREATE_USER: "crear usuarios",
  EDIT_USER: "editar usuarios",
  DELETE_USER: "eliminar usuarios",

  VIEW_ROLE: "ver roles",
  CREATE_ROLE: "crear roles",
  EDIT_ROLE: "editar roles",
  DELETE_ROLE: "eliminar roles",

  CREATE_PATIENT: "crear pacientes",
  VIEW_PATIENT: "ver pacientes",
  EDIT_PATIENT: "editar pacientes",
  DELETE_PATIENT: "eliminar pacientes",

  VIEW_PROFORMA: "ver proformas",
  CREATE_PROFORMA: "crear proformas",
  EDIT_PROFORMA: "editar proformas",
  DELETE_PROFORMA: "eliminar proformas",

  VIEW_ORDER: "ver ordenes",
  CREATE_ORDER: "crear ordenes",
  EDIT_ORDER: "editar ordenes",
  DELETE_ORDER: "eliminar ordenes",

  VIEW_RESULT: "ver resultados",
  CREATE_RESULT: "crear resultados",
  EDIT_RESULT: "editar resultados",
  DELETE_RESULT: "eliminar resultados",
};
