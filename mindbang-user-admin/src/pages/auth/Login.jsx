import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;

  if (!API_AUTH_URL) {
    throw new Error('VITE_API_AUTH_URL no está definida. Verifica tu archivo .env y el modo de build.');
  }

  const handleLogin = async () => {
    if (!email || !password) {
      return alert('Completa todos los campos');
    }
    try {
      await login(email, password);
      navigate('/dashboard');
      setErrorMsg('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">MINDBANG SUITE</h1>
        </div>
        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">Login</h2>

        {/* Error */}
        {errorMsg && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900 p-2 rounded">
            {errorMsg}
          </div>
        )}

        {/* Campos */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Botón */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Ingresar
        </button>

        {/* Link */}
        <div className="text-center">
          <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>  
    );
}
