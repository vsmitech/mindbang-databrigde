import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Overview from './pages/dashboard/Overview.jsx'
import UserList from './pages/dashboard/UserList.jsx'
import RoleManager from './pages/dashboard/RoleManager.jsx'
import AppAccessPanel from './pages/dashboard/AppAccessPanel.jsx'
import './index.css'
import Login from './pages/auth/Login.jsx'
import SessionAlertWrapper from './components/ui/SessionAlertWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* Renderización global del alerta */}
      <SessionAlertWrapper />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} /> {/* Vista por defecto */}
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<UserList />} />
            <Route path="roles" element={<RoleManager />} />
            <Route path="apps" element={<AppAccessPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
