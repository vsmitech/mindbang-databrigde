import { fetchWithAuth } from "./fetchWithAuth";

export async function newUser() {
  return {  
    name: '',
    email: '',
    password: '',
    roles: []
  };
}


export async function getUsers() {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!res.ok){
      console.log(res);
      throw new Error('Error al obtener usuarios');
    } 
    return await res.json();
  } catch (err) {
    console.error('[getUsers]', err);
    console.log(err);
    return [];
  }
};

export async function getUserById(id,token) {
  try {
    // token que recibiste como argumento a fetchWithAuth
        const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    if (!res.ok) throw new Error('Error al obtener usuario');
    return await res.json();
  } catch (err) {
    console.error('[getUserById]', err);
    return null;
  }
}
export async function registerUser(userData) {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear usuario');
    }

    return await res.json();
  } catch (err) {
    console.error('[createUser]', err);
    throw err;
  }
}

export async function updateUser(id, userData) {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Error response:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }

    console.log('Response from updateUser:', res);

    return await res.json();
  } catch (err) {
    console.error('[updateUser]', err);
    throw err;
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      // Envía ambas contraseñas en el body
      body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al cambiar la contraseña');
    }
    return await res.json();
  } catch (err) {
    console.error('[changePassword]', err);
    throw err;
  }
};

export const userService = {
  newUser,
  getUsers,
  getUserById,
  registerUser,
  updateUser
}

export default userService;