
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';

function ProtectedRoute({ children }) {
  const { user } = useAuthContexto();

  if (!user) {
    return <Navigate to="/Registrate" />;
  }

  return children;
}
export default ProtectedRoute;
