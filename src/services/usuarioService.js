import httpClient from "../utils/httpClient"

export default {
    funListarUsuarios: () => {
        return httpClient.get("/users")
    },
    funGuardar: () => {
        return httpClient.post("/users", datos)
    }
}