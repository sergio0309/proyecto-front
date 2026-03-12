import axios from "axios";
//ARCHIVO DEPRECADO, POR FAVOR YA NO USAR
export let BASE_URL;
const dev = false;

if(dev){
    BASE_URL = "http://127.0.0.1:8000";
}else{
    BASE_URL = "https://api-laboratorio.ingeniasoft.cloud/api";
}

// export const BASE_URL = "http://127.0.0.1:8000";
export const BASE_URL_API = `${BASE_URL}`;


export default function Api(){
    
    const token = localStorage.getItem("token")

    const api = axios.create({
        baseURL: BASE_URL_API,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    });
    
    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // error 401 (auth)
            if (error.response?.status === 401){

                localStorage.removeItem("token")
                location.href = "/auth/login"
            }

            return Promise.reject(error)
        }
    )

    return api;
}

export function ApiAuth(){
    
    const token = localStorage.getItem("token")

    const api = axios.create({
        baseURL: BASE_URL_API,
        headers: {
            'Accept': 'application/json',
        }
    });
    
    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // error 401 (auth)
            if (error.response?.status === 401){

                localStorage.removeItem("token")
                location.href = "/auth/login"
            }

            return Promise.reject(error)
        }
    )

    return api;
}