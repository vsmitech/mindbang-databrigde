import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Overview from './pages/dashboard/Overview'
import UserList from './pages/dashboard/UserList'
import RoleManager from './pages/dashboard/RoleManager'
import AppAccessPanel from './pages/dashboard/AppAccessPanel'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import EditUser from './pages/dashboard/EditUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

<Route path="/dashboard/edit-user/:id" element={<div>Ruta alcanzada</div>} />

        {/* Rutas protegidas bajo layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="users" element={<UserList />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          
          <Route path="roles" element={<RoleManager />} />
          <Route path="apps" element={<AppAccessPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
