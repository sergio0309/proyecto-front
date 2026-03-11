// import Api, { ApiAuth } from "./ApiService";
import httpClient from "../utils/httpClient";
export default {
    login(credentials){
        const { email, password } = credentials || {};
        return httpClient.post("login", { email, password });
    },
    logout(){
        return httpClient.post("logout")
    }
}
