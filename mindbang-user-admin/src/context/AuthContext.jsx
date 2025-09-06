import { createContext, useState, useEffect, use } from 'react';
import { authService } from '../services/authService';
import {userService} from '../services/userService';
import { decodeToken } from '../utils/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);   
    const [activeRole, setActiveRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [sessionExpired, setSessionExpired] = useState(false);

    const handleSessionExpired = () => {
        sessionExpired(true)
        logout();   
        setTimeout(() => {
            window.location.href = '/login'; // Redirige
        }, 3000);
        
    }


    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setToken(data.token);     
        // Aquí podría decodificar el token para obtener info del usuario
        const userData = decodeToken(data.token)

        console.log('Datos del usuario desde el token:', userData);

        //Set item en localStorage
        localStorage.setItem('token', data.token);  
        const user = await userService.getUserById(userData._id,data.token);
        setUser(user); // Asignar el usuario obtenido en state
        localStorage.setItem('user', JSON.stringify(user));// Guardar usuario en localStorage
        setActiveRole(user.roles[0]); // Asignar el primer rol como activo por defecto 
        
        
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        setActiveRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.href = '/login'; // Redirige al login
    };

    const isAuthenticated = () => !!token;

    useEffect(() => {
        //Cargar tocken desde localStorage si existe
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Aquí decodificar el token para obtener info del usuario
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user,activeRole,setActiveRole ,login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );

}