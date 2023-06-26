import axios from "axios";
import { getEnvVariables } from "../helpers";

// Tomamos nuestras variables de entorno
const { VITE_API_URL } = getEnvVariables()

// Para este apartado usaremos nuestras variables de entorno
const calendarApi = axios.create({
    baseURL: VITE_API_URL
})

// TODO: Configurar interceptores
// Son funciones predefinidas que se realzian antes de la solicitud
calendarApi.interceptors.request.use( config => {

    // En este header conseguimos el token que tenemos en el localStorage
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;
} )

export default calendarApi;

