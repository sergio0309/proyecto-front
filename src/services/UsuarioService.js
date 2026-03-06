import Api from "./ApiService"

export default {
    getUsuarios(){
        return Api().get("/users")
    }
}