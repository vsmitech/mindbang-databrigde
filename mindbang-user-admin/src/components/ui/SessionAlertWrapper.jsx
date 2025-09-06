// src/components/ui/SessionAlertWrapper.jsx
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SessionAlert from './SessionAlert';

export default function SessionAlertWrapper() {
  const { sessionExpired, setSessionExpired } = useContext(AuthContext);

  if (!sessionExpired) return null;

  return (
    <SessionAlert  message="Tu sesión ha expirado. Serás redirigido al login."  onClose={() => setSessionExpired(false)} />
  );
}
