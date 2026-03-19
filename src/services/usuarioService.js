import httpClient from "../utils/httpClient"

export default {
    funListarUsuarios: () => {
        return httpClient.get("/users")
    },
    funGuardar: (datos) => {
        return httpClient.post("/users", datos)
    }
}