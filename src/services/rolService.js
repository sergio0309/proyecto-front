import Api from "./apiService"

export default {
    funListarRoles: () => {
        return Api().get("/roles")
    },

    funGuardar: (datos) => {
        return Api().post("/roles", datos)
    },
    funModificar: (id, datos) => {
        return Api().put(`/roles/${id}`, datos)
    },
    funEliminar: (id) => {
        return Api().delete(`/roles/${id}`)
    }

}