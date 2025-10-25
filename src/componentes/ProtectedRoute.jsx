
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';

function ProtectedRoute({ children }) {
  const { user, isCliente } = useAuthContexto();

  // Requiere que el usuario esté logueado Y sea cliente
  // si no es usuario ni cliente que redirija a registrarse

  if (!user || !isCliente) {
    return <Navigate to="/Registrate" />;
  }

  return children;
}
export default ProtectedRoute;
