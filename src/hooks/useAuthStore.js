import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";


export const useAuthStore = () => {

    const { status, user, errorMessage  } = useSelector( state => state.auth );
    const dispatch =  useDispatch();


    const startLogin = async({ email, password }) => {

        dispatch( onChecking() );        
        // Al tratarse de una peticion asincrona entonces tenemos que 
        try {
            // Esperaremos la respuesta de nuestro servidor backend, Conseguiremos la variable de entorno que hemos configurado con anterioridad 
            const { data } = await calendarApi.post('/auth', { email, password });
            // Almacenamos el token el localStorage
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            // Tenemos disponible en name y uid, y se lo pasamos al name y al uid
            dispatch( onLogin({ name: data.name, uid: data.uid  }) );

        } catch (error) { 

            // Colocamos un mensaje de error
            dispatch( onLogout('Credenciales Incorrectas') );
            // Pasado un tiempo usarmos una acion para poder borrar el mensaje de error
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);  

        }
    }

    // startRegister

    const startRegister = async({ email, password, name }) => {

        dispatch( onChecking() );        
        // Al tratarse de una peticion asincrona entonces tenemos que 
        try {
            // Esperaremos la respuesta de nuestro servidor backend, Conseguiremos la variable de entorno que hemos configurado con anterioridad 
            const { data } = await calendarApi.post('/auth/new', { email, password, name });
            // Almacenamos el token el localStorage
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            // Tenemos disponible en name y uid, y se lo pasamos al name y al uid
            dispatch( onLogin({ name: data.name, uid: data.uid  }) );

        
        } catch (error) { 

            console.log(error.response.data?.msg);
            // Colocamos el error que recibimos por parte del servidor dentro del aler de sweetalert 
            dispatch( onLogout( error.response.data?.msg || '--' ) );
            // Pasado un tiempo usarmos una acion para poder borrar el mensaje de error
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);  
        }
    }


    const checkAuthToken = async() =>{
        const token = localStorage.getItem('token');
        if( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('auth/renew' );
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
        
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );
    }

    return{
        // Propiedades
        status, 
        user,
        errorMessage,

        // Metodos
        checkAuthToken,
        startLogin,
        startRegister,
        startLogout,
    }


}