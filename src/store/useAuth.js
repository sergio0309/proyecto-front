import { defineStore } from "pinia";
import { ref } from "vue";
import AuthService from "../services/authService";
import { setPermissions } from "../core/ability";
/**
 * Store global para manejar la autenticación del usuario (login, logout, token)
 * y compartir el estado de autenticación en toda la app.
 *
 * Esta es la mejor manera de desacoplar la lógica de autenticación del resto de la app(componentes, ej: Login.vue), y evitar repetir código en cada componente.
 * - El store se encarga de llamar al servicio (AuthService) para hacer login/logout, y guarda el token y datos del usuario en su estado.
 * - Cualquier componente puede acceder a este store para saber si el usuario está autenticado, obtener su información, o hacer logout.
 * - El token se guarda en localStorage para persistir la sesión, y también se mantiene en el estado del store para acceso rápido.
 * @object AuthStore - id: 'auth'
 * @property {Object|null} user - Información del usuario autenticado (puede ser null si no hay sesión)
 * @property {string|null} token - Token de autenticación (puede ser null si no hay sesión)
 * @property {boolean} loading - Flag que indica si se está procesando una acción de autenticación (ej: "Cargando...Espere pibe", esto es full UX)
 * @method login - recibe email y password: Realiza el proceso de login con las credenciales proporcionadas y actualiza el estado del store con el token y datos del usuario.
 * @method logout - Realiza el proceso de logout, limpiando el token y datos del usuario del estado del store y localStorage.
 */
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);
  const loading = ref(false);

  async function login(credentials) {
    loading.value = true;
    try {
      const response = await AuthService.login(credentials);
      console.log("respuesta del login", response.data);
      // Guardamos el token en Pinia y en localStorage
      token.value =
        response.data?.token || alert("Error in the backend [RESPONSE]"); // SOLO para debug-> TODO: borrar esto en prod
      localStorage.setItem("token", token.value);

      // 3. (Opcional) Guardamos datos del usuario si el login los devuelve (ej. para el perfil tipo: <h1> {{user.name}} </h1>)
      user.value = response.data.user || null;

      if (user.value) {
      localStorage.setItem("user", JSON.stringify(user.value));

      const permissions = extractPermissions(user.value);
      setPermissions(permissions);
      }

      if (user.value) {
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return true; // Retornamos true para que el componente sepa que fue un éxito
    } catch (error) {
      user.value = null;
      console.log("Error en useAuth", error.response);
      throw error; // Volvemos a lanzar el error para que el componente que llamó a login() pueda manejarlo (ej: mostrar mensaje de error específico)
    } finally {
      loading.value = false; //flag false del ux desaparece...
    }
  }

  /**Setear el user correctamente sin que la UI se vuelva loca */
  async function fetchUser() {
    if (!token.value) return;

    loading.value = true;
    try {
      const response = await AuthService.getUser();
      user.value = response.data;
     
      const permissions = extractPermissions(user.value);
      setPermissions(permissions);

      console.log("Sesión recuperada:", user.value.name);
    } catch (error) {
      console.error("Token inválido o expirado");
      logout(); // Si falla el /me, el token no sirve: Limpiamos y al Login
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn(
        "Error al hacer logout en el server, limpiando localmente de todos modos.",
      );
    } finally {
      // Limpiamos todo sin importar lo que diga el backend
      user.value = null;
      token.value = null;
      localStorage.removeItem("token");
    }
  }

  /**
   * Extrae los permisos del usuario para setear qué puede o no puede hacer
   * cada usuario con roles específicos (+ permisos delegados obviamente)
   * @param {Object|null} user 
   * @returns {string[]} - array de permisos (ej: ["crear usuarios", "ver roles", etc])
   */
  function extractPermissions(user) {
    if (!user) return [];

    // ✅ futuro ideal
    // TODO: el backend debe mostrar permisos [] con /me más adelante
    if (user.permissions) return user.permissions;

    // backend actual (al hacer GET a /roles → devuelve  permisos[])
    if (user.roles) {
      return user.roles.flatMap((role) => role.permissions ?? []);
    }

    return [];
  }

  return {
    user,
    token,
    loading,
    login,
    logout,
    fetchUser,
    extractPermissions
  };
});
