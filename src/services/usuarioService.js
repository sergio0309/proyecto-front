import Api from "./apiService"

export default {
    funListarUsuarios: () => {
        return Api().get("/users")
    },
    funGuardar: () => {
        return Api().post("/users", datos)
    }
}