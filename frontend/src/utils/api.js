import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Configurar Axios con un `Interceptor` para adjuntar el token automáticamente
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
