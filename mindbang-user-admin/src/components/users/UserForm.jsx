import { useState, useEffect } from "react";
import { validateUser } from '../../utils/validators';
import { updateUser, registerUser, changePassword } from '../../services/userService';
import { FiUser, FiMail, FiShield, FiKey, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import RoleSelector from "../roles/RoleSelector";

const UserForm = ({ initialData = {}, onSubmit }) => {

    // Estados para el formulario
    const [errors, setErrors] = useState([]);
    const [msgSuccess, setMsgSuccess] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    
    const [form, setForm] = useState({
        username: '',
        email: '',
        roles: [],
        ...initialData
    });

    const togglePasswordVisibility = (fieldName) => {
        if (fieldName === 'password') {
            setShowPassword(prev => !prev);
        } else if (fieldName === 'newPassword') {
            setShowNewPassword(prev => !prev);
        }
        else if (fieldName === 'confirmNewPassword') {
            setShowConfirmPassword(prev => !prev);
        }
    };

    useEffect(() => {
        setForm({
            username: '',
            email: '',
            roles: [],
            ...initialData
        });

        setErrors([]);
        setMsgSuccess([]);

    }, [initialData]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        //preventDefault();
        setErrors([]);
        setMsgSuccess([]);
        const validation = validateUser(form);
        if (validation.length) return setErrors(validation);

        if (form.newPassword !== form.confirmNewPassword) {
            return setErrors(['Las contraseñas no coinciden']);
        }

        try {
            const result = form._id
                ? await updateUser(form._id, form)
                : await registerUser(form);

            if (result.user && result.user._id)
                onSubmit(result.user);
            else {
                console.error('Unexpected response from service:', result.message);
                console.log('Full response:', result);
            }

            // Si la contraseña se llena, cambiarla
            if (form.password) {
                const passwordChangeResult = await changePassword(form.password, form.newPassword);
                if (!passwordChangeResult.success) {
                    setErrors([passwordChangeResult.message || 'Error al cambiar la contraseña']);
                }
                else {
                    setMsgSuccess([passwordChangeResult.message || 'Contraseña cambiada con éxito']);
                }
            }

        } catch (err) {
            setErrors([err.message || 'Error al guardar']);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiUser className="inline mr-1" /> Nombre de usuario
                </label>
                <input
                    type="text"
                    value={form.username}
                    onChange={e => handleChange('username', e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: admin"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiMail className="inline mr-1" /> Email
                </label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: contacto@dominio.com"
                />
            </div>

            {/* Password Actual*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiKey className="inline mr-1" /> Contraseña
                </label>
                <div className="flex items-center">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={form.password || ''}
                        onChange={e => handleChange('password', e.target.value)}
                        className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={form._id ? "Dejar en blanco para no cambiar" : "Ej: ********"}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="py-2 px-3 rounded-r-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
            </div>

            {/* New Password*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiKey className="inline mr-1" /> Nueva Contraseña
                </label>
                <div className="flex items-center">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={form.newPassword || ''}
                        onChange={e => handleChange('newPassword', e.target.value)}
                        className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={form._id ? "Dejar en blanco para no cambiar" : "Ej: ********"}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className="py-2 px-3 rounded-r-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
            </div>
            {/* Confirm Password*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiCheck className="inline mr-1" /> Confirmar Contraseña
                </label>
                <div className="flex items-center">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmNewPassword || ''}
                        onChange={e => handleChange('confirmNewPassword', e.target.value)}
                        className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={form._id ? "Dejar en blanco para no cambiar" : "Ej: ********"}
                    />
                    <button
                        type="button" // Evita que el botón envíe el formulario
                        onClick={() => togglePasswordVisibility('confirmNewPassword')}
                        className="py-2 px-3 rounded-r-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />} {/* Muestra el ícono correcto */}
                    </button>
                </div>
            </div>

            {/* Rol */}
            <div>
                {/* Roles */}
               <RoleSelector
                    selectedRoles={form.roles  || []}
                    onChange={(roles) => setForm(prev => ({ ...prev, roles }))}
                />
            </div>

            {/* Errores */}
            {errors.length > 0 && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded text-sm space-y-1">
                    {errors.map((err, i) => (
                        <div key={i}>• {err}</div>
                    ))}
                </div>
            )}

            {/* Success Messages */}
            {msgSuccess.length > 0 && (
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-purple-300 p-2 rounded text-sm space-y-1">
                    {msgSuccess.map((msg, i) => (
                        <div key={i}>• {msg}</div>
                    ))}
                </div>
            )}

            {/* Botón */}
            <button
                type="button"
                className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                onClick={handleSubmit}
            >
                {form._id ? 'Actualizar' : 'Crear usuario'}
            </button>
        </form>
    );

};

export default UserForm;