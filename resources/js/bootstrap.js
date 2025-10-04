import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar CSRF token para peticiones Axios
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Interceptor para manejar redirecciones de autenticación
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si recibimos un error 401 o 419, redirigir al login
        if (error.response?.status === 401 || error.response?.status === 419) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
