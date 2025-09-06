import axios from "axios";

const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;
let token = null;
let refreshToken = null;


const instance = axios.create({
    baseURL: API_AUTH_URL,    
    withCredentials: true // Habilitar el envío de cookies
});

// Interceptor para agregar el token a las solicitudes
instance.interceptors.request.use(config => {
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


// Interceptor para manejar expiración de token y refrescarlo automáticamente
instance.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && refreshToken) {
      try {
        const res = await instance.post('/auth/refresh-token', { refreshToken });
        token = res.data.token;
        err.config.headers.Authorization = `Bearer ${token}`;
        return instance(err.config); // Reintenta la request original
      } catch (refreshErr) {
        console.error('Error al refrescar token:', refreshErr);
        throw refreshErr;
      }
    }
    throw err;
  }
);


export async function login(email, password) {
  if (!API_AUTH_URL) {
    throw new Error('URL de servicio de autenticación no está definida. Verifica archivos de entorno (comunica al administrador).');
  }

  const response = await axios.post(`${API_AUTH_URL}/login`, { email, password }, { withCredentials: true });
  token = response.data.token; // Guardar el token en la variable
  return response.data;
}  

export function logout() {
    token = null;
    refreshToken = null;
}

export function getToken() {
  return token;
}

export function isAuthenticated() {
  return !!token;   
}


//Singleton pattern
export const authService = {
  login,
  logout,
  isAuthenticated,
  getToken 
}