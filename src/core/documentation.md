# Delegación de Acceso al frontend

- El front debe mantener una capa de protección de rutas y acciones (crear usuario, eliminar rol, editar paciente,etc.) basada en los permisos del usuario logueado, para evitar que un usuario sin permisos vea botones o rutas a las que no debería tener acceso.

- El backend (Laravel) devuelve conjuntamente rutas como `issy-clinica.com/api/me` donde este devuelve este cuerpo base de respuesta:

```json
{
  "id": 1,
  "name": "Admin modificado",
  "email": "textcorregido@gmail.com",
  "email_verified_at": null,
  "ci": "12342131",
  "phone": "3412412411",
  "address": "Laboratorio Central",
  "fecha_nacimiento": "1995-05-20",
  "img": "users/0LkpXG4shuygnk4dPJRJlQLLaTFFyquXLnzaOku8.png",
  "status": 1,
  "created_at": "2026-02-27T13:56:27.000000Z",
  "updated_at": "2026-03-27T20:48:42.000000Z",
  "roles": [
    {
      "id": 1,
      "name": "Super Admin",
      "guard_name": "api",
      "created_at": "2026-02-27T13:56:26.000000Z",
      "updated_at": "2026-02-27T13:56:26.000000Z",
      "pivot": {
        "model_type": "App\\Models\\User",
        "model_id": 1,
        "role_id": 1
      }
    }
  ],
  "permissions": []
}
```

- 🔴 por ahora permissions[] está vacío (no devuelve permisos). El backend (Wil) debe implementar en las rutas api de Laravel (en "/me") la facilidad de que este campo venga con un array de strings con los permisos del usuario, para que el frontend pueda usarlo.

# IDEA BASE (el porqué de estos archivos ability - permissions): Una sola fuente de verdad de permisos en el frontend.

- En el frontend, se crea un archivo src/core/permissions.js donde se definen constantes con los nombres de los permisos (esto evita strings mágicos), por ejemplo:

```js
export const PERMISSIONS = {
  VIEW_USER: "ver usuarios",
  CREATE_USER: "crear usuarios",
  EDIT_USER: "editar usuarios",
  DELETE_USER: "eliminar usuarios",
  ... etc.
};
```

- ability.js => aquí vive `can("puede hacer esta acción")`
- can() es el método por el cual el FRONTEND consulta si el usuario tiene un permiso específico. Este método se puede usar en cualquier parte del código, por ejemplo:

---

<Button
v-if="can(PERMISSIONS.EDIT_USER)"
@click="editUser(user.id)"
/>

---

# La relación con el store de Pinia useAuth.js

- useAuth.js es el store de Pinia donde se guarda la información del usuario logueado (fetchUser), incluyendo sus roles y permisos. Este store tiene un método llamado `extractPermissions(user)` que se encarga de extraer los permisos del usuario a partir de la respuesta del backend (ya sea directamente desde el campo permissions[] o a través de los roles).

- El futuro ideal (o sea cómo debería funcionar esto) es que el backend devuelva directamente un array de permisos en el campo permissions[] al hacer GET a /me, para que el método extractPermissions simplemente retorne ese array sin necesidad de hacer lógica adicional ni nada loco o dificil, es puro seteo de permisos nada más.

# Dev notes

- 31/marzo/2026 🔴 NOTA IMPORTANTE 🔴: por el momento estamos planificando que el backend devuelva al objeto user (/me) conjuntamente con los permisos asignados (Wil debe hacer el cambio y actualizar esta parte, queda pendiente).

- TODO: EL backend debe validar la lógica de acceso al frontend según los permisos principales como ser el `ver ENTITY`. Ejemplo:
  - Si un usuario tiene los permisos de crear, editar y eliminar. PERO NO tiene los de "ver", entonces hace todo y nada a la vez. => debe solucionarse con Rules en el backend Laravel.
  - El backend debe validar que como mínimo obligatoriamente esta regla para el acceso al frontend:
    1. un usuario debe tener acceso de "ver ENTITY" como mínimo para que pueda acceder a esa sección del frontend, sino no debería poderse guardar el usuario sin ese permiso, o no debería mostrarle esa sección del frontend
    2. esto es algo que el backend debe validar, porque si el backend no valida esto, el frontend tampoco puede hacer nada al respecto, ya que el frontend se basa en la información que le da el backend (permisos) para mostrar u ocultar cosas.

# POR HACER:
TODO:
1. Wil: implementar en el backend Laravel que al hacer GET a /me, este devuelva un array de permisos en el campo permissions[] (en vez de devolverlo anidado dentro de roles[] como se hace actualmente). Esto es para que el frontend tenga una sola fuente de verdad de permisos y no tenga que hacer lógica adicional para extraer los permisos a partir de los roles.
2. Implementar can('permiso específico') en el frontend (En los Componentes por ej. UsuariosTable.vue), para que este método consulte el store de useAuth.js y verifique si el usuario tiene ese permiso específico.
3. Correjir el router (index.js) para que las rutas también estén protegidas por permisos, es decir, que si un usuario intenta acceder a una ruta para la cual no tiene permisos, sea redirigido a una página de "Acceso Denegado" o algo similar.
