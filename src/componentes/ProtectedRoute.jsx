
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';

function ProtectedRoute({ children }) {
  const { user, isCliente } = useAuthContexto();
  const location = useLocation();

  // Requiere que el usuario esté logueado Y sea cliente
  // si no es usuario ni cliente que redirija a registrarse con información de origen

  if (!user || !isCliente) {
    return <Navigate to="/Registrate" state={{ from: location.pathname }} replace />;
  }

  return children;
}
export default ProtectedRoute;
