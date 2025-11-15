import React from 'react';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import AdminLogin from './adminComponents/AdminLogin.jsx';

// Ruta protegida SOLO para administradores. Si no hay sesión admin muestra el formulario específico.
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuthContexto();

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return children;
}

export default AdminRoute;
