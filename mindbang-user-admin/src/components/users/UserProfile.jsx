import { useState, useEffect } from "react";
import { FiUser, FiBriefcase, FiGlobe, FiSun, FiCheck, FiSave } from "react-icons/fi";
import userProfileService from '../../services/userProfileService'; // Asumiendo que tienes este servicio
import { isValidURL } from '../../utils/validators'; // Puedes usar una función de validación similar

export default function UserProfile({user}){const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    // Efecto para obtener los datos del perfil cuando el userId cambia
    useEffect(() => {
        if (!userId) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await userProfileService.getUserProfile(userId);
                setProfile(data);
                setErrors([]);
            } catch (err) {
                console.error("Error al obtener el perfil:", err);
                setErrors(['Error al cargar el perfil del usuario.']);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setProfile(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfile(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        
        // Aquí puedes agregar validaciones si es necesario

        try {
            const updatedProfile = await  userProfileService.updateUserProfile(userId, profile);
            onSubmit(updatedProfile);
        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            setErrors([err.message || 'Error al actualizar el perfil.']);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Cargando perfil...</div>;
    }

    if (!profile) {
        return <div className="text-center py-4 text-gray-500">Selecciona un usuario para ver su perfil.</div>;
    }
    
    // Mapeo para los roles y la organización (asumiendo que los recibes como strings)
    const rolesList = Array.isArray(profile.roles) ? profile.roles.join(', ') : 'No asignados';
    const lastLoginFormatted = profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A';
    const createdAtFormatted = profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A';
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiUser className="inline mr-1" /> Nombre completo
                </label>
                <input
                    type="text"
                    value={profile.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez"
                />
            </div>

            {/* Position */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiBriefcase className="inline mr-1" /> Cargo
                </label>
                <input
                    type="text"
                    value={profile.position || ''}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Gerente de Proyectos"
                />
            </div>
            
            {/* Preferences */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiGlobe className="inline mr-1" /> Preferencias
                </label>
                <div className="space-y-2 pl-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idioma:</label>
                        <select
                            value={profile.preferences?.language || 'es'}
                            onChange={(e) => handleChange('preferences.language', e.target.value)}
                            className="px-2 py-1 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="es">Español</option>
                            <option value="en">Inglés</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Read-only fields */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Información de Sistema</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400">ID de Usuario:</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{profile.userId}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400">Roles:</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{rolesList}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400">Último Acceso:</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{lastLoginFormatted}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400">Creado en:</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{createdAtFormatted}</p>
                    </div>
                </div>
            </div>

            {/* Mensajes de error */}
            {errors.length > 0 && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded text-sm">
                    {errors.map((err, i) => (
                        <div key={i}>{err}</div>
                    ))}
                </div>
            )}

            {/* Botón */}
            <button
                type="submit"
                className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
                <FiSave className="inline mr-1" /> Actualizar Perfil
            </button>
        </form>
    );
};
