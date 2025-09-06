// fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {
    // Si el token es pasado en los encabezados, úsalo directamente
    const token = options.headers?.Authorization?.split(' ')[1] || localStorage.getItem('token');
    
    // Asegúrate de que el token sea una cadena válida antes de construir el encabezado
    if (!token || typeof token !== 'string' || token === 'null' || token === 'undefined') {
        const res = await fetch(url, options);
        if (res.status === 401) {
            // Maneja el caso de no autenticado
            window.location.href = '/login';
        }
        return res;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${token}`
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });
    
    // Si la sesión expira, maneja el error
    if (res.status === 401) {
        // logout y redirección
    }

    return res;
}