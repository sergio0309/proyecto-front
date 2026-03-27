import httpClient from "../utils/httpClient"

export default {
    funListarUsuarios: () => {
        return httpClient.get("/users")
    },
    
    funGuardar: (datosFormData) => {
        return httpClient.post("/users", datosFormData);
    },

    funActualizar: (id, datosFormData) => {
        return httpClient.post(`/users/${id}`, datosFormData);
    },

    funEliminar: (id) => {
        return httpClient.delete(`/users/${id}`);
    }
}