import httpClient from "../utils/httpClient"

export default {
    funListarRoles: () => {
        return httpClient.get("/roles")
    },

    funGuardar: (datos) => {
        return httpClient.post("/roles", datos)
    },
    funModificar: (id, datos) => {
        return httpClient.put(`/roles/${id}`, datos)
    },
    funEliminar: (id) => {
        return httpClient.delete(`/roles/${id}`)
    }

}