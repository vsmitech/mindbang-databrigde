import { fetchWithAuth } from "./fetchWithAuth";

/**
 * URL base del servicio de perfiles de usuario.
 * Se asume que esta URL está definida en tu archivo .env
 */
const API_URL = `${import.meta.env.VITE_API_USER_URL}/profiles`;

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
      const error = await res.json();
      throw new Error(error.message || `Error al obtener el perfil del usuario con ID: ${userId}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[userProfileService.getUserProfile]', err);
    throw err;
  }
}

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
  updateUserProfile

}

export default userProfileService;