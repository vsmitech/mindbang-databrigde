import { fetchWithAuth } from "./fetchWithAuth";

export async function getRoleList() {
  try {  
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_AUTH_URL}/roles`, {
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
    let response = await res.json();    
    return response;
  } catch (err) {
    console.error('[getRoleList]', err);
    console.log(err);
    return [];
  }
};


export const roleService = {
  getRoleList
}

export default roleService;