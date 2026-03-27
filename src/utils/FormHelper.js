/**
 * 🔵 Transforma un objeto plano a una instancia de FormData.
 * * Por qué usar esto: 
 * - Permite el envío de archivos binarios (imágenes) que JSON no soporta nativamente.
 * - Maneja el "Method Tunneling" de Laravel (`_method`) para peticiones PUT/PATCH con archivos.
 * - Formatea arreglos automáticamente usando la sintaxis `key[]` que espera el backend.
 * * @param {Object} obj - Objeto con los datos del formulario (ej: `{ name: 'Juan', roles: [...] }`).
 * @param {string|null} [method=null] - Método HTTP a simular (ej: 'PUT', 'PATCH'). Laravel requiere esto para procesar archivos en actualizaciones.
 * @returns {FormData} Una instancia de FormData lista para ser enviada por httpClient (Axios).
 */
export const objectToFormData = (obj, method = null) => {
  const formData = new FormData();

  if (method) formData.append("_method", method);

  for (const key in obj) {
    if (key === "archivoImagen" || key === "img") continue;

    let value = obj[key];

    if (value === null || value === undefined) continue;

    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      value = `${year}-${month}-${day}`;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const valToSend =
          typeof item === "object" && item !== null
            ? item.id || item.name || JSON.stringify(item)
            : item;

        formData.append(`${key}[]`, valToSend);
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
    } else {
      formData.append(key, value);
    }
  }

  if (obj.archivoImagen instanceof File || obj.archivoImagen instanceof Blob) {
    formData.append("img", obj.archivoImagen);
  }

  return formData;
};