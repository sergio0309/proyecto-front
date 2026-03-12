import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * Store global para manejar los errores que se reciban del backend
 * y limpiarlos, obteniendo un handler centralizado.
 */
export const useErrorStore = defineStore("useError", () => {
  /**
   * @typedef {Object} error
   * @property {string|null} credentialsError - Error de credenciales inválidas (ej: código 401)
   * @property {Object<string, string>|null} validationErrors - Errores de validación del servidor (ej: código 422)
   * @property {string|null} serverError - Error interno del servidor (ej: código 500)
   * @property {Object|null} httpError - Error HTTP genérico con detalles completos de la respuesta
   * @property {string|null} networkError - Error de conexión de red (ej: timeout, CORS, DNS)
   * @property {string|null} unknownError - Error no categorizado o desconocido
   *
   * Cada propiedad está inicializada a null para indicar ausencia de error en esa categoría.
   */
  const error = ref(getInitialError());

  /**
   * Retorna la estructura inicial de errores
   */
  function getInitialError() {
    return {
      credentialsError: null,
      validationErrors: null,
      serverError: null,
      httpError: null,
      networkError: null,
      unknownError: null,
      uiError: null
    };
  }

  /**
   * Resetea los valores de error("validationErrors", "serverError", "httpError"...)
   */
  function resetError() {
    error.value = getInitialError();
  }

  /**
   * Normalizador de errores recibidos desde el backend o desde el catching (try-catch) en cualquier método para hacer peticiones al backend.
   * @param {object} err - recibido desde el catching (try->`catch`) de cualquier método donde es utilizado dicho handler de errores - Es el error CRUDO o preformateado
   * Asigna errores a las propiedades del objeto `error` según el estado (`status`) y el código de la respuesta.
   */
  function handleError(err) {
    console.log("🔴 [DEBUG] Error crudo de Axios:", err);
    console.log("🔴 [DEBUG] Data del response:", err.response?.data);
    resetError();

    if (!err) {
      error.value.unknownError = "Error desconocido";
      return;
    }

    const status = err.response.status;
    const data = err.response.data;

    switch (status) {
      case 422:
        // 🔵 OJO: Laravel manda { message: '...', errors: { email: [] } }
        // Si guardas 'data' entero, el v-for de la UI va a intentar iterar el string 'message' y va a crashear.
        error.value.validationErrors = data.errors || {};
        break;

      case 401:
      case 403:
        // 🔵 Aquí es donde Laravel suele avisar que las credenciales no van
        error.value.credentialsError =
          data.message || "No tienes permiso o credenciales inválidas";
        break;

      case 500:
        error.value.serverError =
          "El servidor no funcionó (500). Avisale al de Backend.";
        break;

      default:
        error.value.unknownError =
          data.message || "Error inesperado. Intenta más tarde.";
    }
  }

  /**
   * seteador de errores UI, para mostrar mensajes de error personalizados que no vienen del backend,
   * sino que son generados en la lógica del frontend (ej: "Por favor completa todos los campos").
   * @param {Object} message 
   */
  function setUiError(message) {
    resetError()
    error.value.uiError = message
  }

  /**
   * Limpia todos los errores para que no se vean en los forms.
   * Pensado para ejecutarse en cambios de vista o al montar componentes.
   * se usa en los componentes donde se implementa `<ErrorSection />` utilizando: `onMounted()`
   */
  function clearErrors() {
    console.log("Ejecutando clearErrors...");
    error.value = getInitialError();
    console.log("Valor de error:", error.value);
  }

  /**
   * Computed para saber si hay algún error activo.
   * Esto evita que `v-if="errorStore.error"` sea truthy siempre.
   */
  const hasError = computed(() =>
    Object.values(error.value).some((val) => val !== null && val !== undefined),
  );

  return {
    error,
    resetError,
    handleError,
    clearErrors,
    hasError,
    setUiError
  };
});
