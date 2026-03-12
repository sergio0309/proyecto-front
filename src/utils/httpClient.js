import axios from "axios";

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
    const token = localStorage.getItem("access_token");
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
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isLoginRequest = url === "/login" || url?.endsWith("/login");

    // esto significa que si el login incluye un 401 Y la URL incluye "login", la sesión se elimina y se retorna a "auth/login"
    if (status === 401 && !isLoginRequest) {
      console.warn("Sesión expirada o no autorizada.");

      localStorage.removeItem("access_token");

      // TODO: Mejorar esto en prod
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);

export default httpClient;
