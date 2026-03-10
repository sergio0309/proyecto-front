import Api from "./apiService"

export default {
    getUsuarios(){
        return Api().get("/users")
    }
}