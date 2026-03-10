import Api from "./apiService"

export default {
    funListarPermisos: () => {
        return Api().get("permissions")
    }
}