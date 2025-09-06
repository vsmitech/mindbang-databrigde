import {jwtDecode} from 'jwt-decode';

export const saveToken = token => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');

export function decodeToken(token) {
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (err) {
        console.error('Error decoding token', err);
        return null;
    }
}
