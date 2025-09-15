import { fetchWithAuth } from "./fetchWithAuth";

/**
 * URL base del servicio de perfiles de usuario.
 * Se asume que esta URL está definida en tu archivo .env
 */
const API_URL = `${import.meta.env.VITE_API_USER_URL}/user`;

/**
 * Obtiene el perfil de un usuario por su ID.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Object>} El objeto del perfil del usuario.
 */
export async function getUserProfile(userId) {
  try {
    const res = await fetchWithAuth(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {

      // Manejo especial para 404
      if(res.status === 404) {
        return null; // Perfil no encontrado
      }

      const error = await res.json();
      throw new Error(error.message || `Error al obtener el perfil del usuario con ID: ${userId}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[userProfileService.getUserProfile]', err);
    throw err;
  }
}


export async function syncUserProfile(profileData) {
  try {
    console.log('Syncing user profile with data:', profileData);
    const res = await fetchWithAuth(`${API_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(profileData)
    }); 
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al sincronizar el perfil del usuario');
    } 
    return await res.json();
  } catch (err) {
    console.error('[userProfileService.syncUserProfile]', err);
    throw err;
  }
};


/**
 * Actualiza el perfil de un usuario.
 * @param {string} userId - El ID del usuario.
 * @param {Object} profileData - Los datos del perfil a actualizar.
 * @returns {Promise<Object>} El objeto del perfil del usuario actualizado.
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const res = await fetchWithAuth(`${API_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Error al actualizar el perfil del usuario con ID: ${userId}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[userProfileService.updateUserProfile]', err);
    throw err;
  }
}


export const userProfileService = {
  getUserProfile,
  updateUserProfile,
  syncUserProfile

}

export default userProfileService;