import httpClient from "../utils/httpClient"

export default {
    funListarPermisos: () => {
        return httpClient.get("permissions")
    }
}