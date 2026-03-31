/**
 * Maneja los permisos del usuario actual en memoria.
 * Se setea al hacer login, y se puede usar en cualquier parte del código con la función can('nombre_permiso')
 * Ejemplo de uso: <button v-if="can(PERMISSIONS.CREATE_USER)">Crear Usuario</button>
 */
let currentPermissions = new Set()

export function setPermissions(permissions = []) {
  currentPermissions = new Set(permissions)
}

export function can(permission) {
  return currentPermissions.has(permission)
}