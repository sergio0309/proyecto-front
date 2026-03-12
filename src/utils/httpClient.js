import axios from "axios";
import router from "../router";

/**
 * httpClient.js - Configuración centralizada de Axios para toda la app
 * 🔵 Objetivo: Crear UNA SOLA INSTANCIA de Axios con interceptores para manejar el token y errores de autenticación
 * 🔵 Beneficios:
 *  - Evita repetir código de configuración en cada servicio
 * - Centraliza el manejo de errores 401 (sesión expirada)
 * - Permite cambiar la URL base o headers en un solo lugar
 *
 * 🔵 Uso: Importar esta instancia en los servicios (como ApiService.js) para hacer las llamadas a la API
 *
 */

// 🔵 1. Crea una instancia de Axios con configuración base
const httpClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://api-laboratorio.ingeniasoft.cloud/api",
  timeout: 10000, // Opcional: tiempo máximo de espera para una respuesta, 10 segundos en este caso
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 🔵 2. Interceptor de PETICIÓN (Request) - Se ejecuta ANTES de que el frontend dispare la llamada
httpClient.interceptors.request.use(
  (config) => {
    // Leemos el token justo en el momento de la petición, así siempre está actualizado
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 🔵 3. Interceptor de RESPUESTA (Response) - Limpio, sin sobreescribir la data
httpClient.interceptors.response.use(
  (response) => {
    // Todo salió bien (Status 2xx), devolvemos la respuesta TAL CUAL, sin modificarla
    // POR FAVOR NO SOBREESCRIBIR LA RESPUESTA AQUI (nada de if response.data.status == 501, etc)
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Hacemos el match más flexible y robusto.
    const isAuthEndpoint = url.includes("/login") || url.includes("/auth");

    if (status === 401) {
      // 1. Si es un 401 PROVOCADO por un intento de login fallido,
      // lo dejamos pasar al catch() del componente para que muestre el error visual.
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // 2. Si es un 401 en cualquier OTRA parte (ej. token expirado al pedir datos del laboratorio)
      console.warn("Sesión expirada o no autorizada. Redirigiendo...");
      localStorage.removeItem("token");

      // Importación dinámica del router para evitar la dependencia circular
      const { default: router } = await import("../router");

      // Verificamos de nuevo dinámicamente para evitar loops de redirección
      if (router.currentRoute.value.name !== "Login") {
        // Asegúrate que coincida con el nombre exacto en router.js
        router.push({ name: "Login" });
      }
    }

    return Promise.reject(error);
  },
);

export default httpClient;
