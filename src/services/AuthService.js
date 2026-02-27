import Api, { ApiAuth } from "./ApiService";

export default {
    login(credenciales){
        return ApiAuth().post("login", credenciales);
    },
    // register(datos){
    //     return ApiAuth().post("/v1/auth/register", datos);
    // },
    // perfil(){
    //     return Api().get("/v1/auth/profile");
    // },
    logout(){
        return Api().post("logout")
    }
}
