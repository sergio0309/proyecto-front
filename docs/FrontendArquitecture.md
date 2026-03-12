# Arquitectura Frontend de la aplicación

El consumo de la data (API Rest Laravel) pasa a través de `httpClient.js` como archivo PRINCIPAL
Este util (httpClient) crea una sola instancia de Axios para optimizar requests al servidor
Además éste, tiene un pequeño interceptor de respuestas básico que encaja el Bearer token solo cuando sea necesario.

-`httpClient.js` es un archivo fundamental para las peticiones y presentación de datos de la aplicación, ahí se crea la instacia de `axios` + el objeto de configuración general (baseURL,headers,timeout) para hacer las peticiones al backend

-HttpClient puede usarse en Services o Stores sin problemas donde el interceptor se encarga de poner el token si el endpoint lo requiere.

-HttpClient es el nuevo ApiService, pero en vez de zapatillas ahora tiene traje y zapatos (y una pistola porsi).

-los componentes se basan en `@/Services` donde cada uno tiene su propia entidad y trabaja conjuntamente con cada `@/Store` (ej. AuthService utiliza httpClient.js y este servicio trabaja con useAuhtAdmin/useAuthPublic)

# Developer Notes

- Siempre revisar el cuerpo de la respuesta (response.data, "data" es lo que retorna `Axios`), no usar response.message, ni response.request, ni nada raro. => ESTO para no perder tiempo en saber que carajos responde laravel (API REST)
