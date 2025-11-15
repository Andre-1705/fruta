
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';

// Componente de ruta protegida: exige solamente que el usuario esté logueado.
// Si NO hay usuario (no está autenticado) redirige a la pantalla de "Registrate" / login
// pasando en el state la ruta de origen para poder volver al carrito luego del login.
function ProtectedRoute({ children }) {
  const { user } = useAuthContexto(); // quitamos isCliente: ver carrito sólo requiere estar logueado
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
