import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './Registrate.css'; // Reutilizamos estilos

// Página dedicada de Inicio de Sesión
function InicioSesion() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensajeLogin, setMensajeLogin] = useState('');
  const { registrarUsuario, user } = useAuthContexto();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar ruta de origen protegida
  const from = location.state?.from || '/VistaCarrito';

  useEffect(() => {
    if (location.state?.from) {
      setMensajeLogin('Debes iniciar sesión para acceder a esta sección');
    }
    // Si ya hay usuario autenticado, ir directo a destino
    if (user) {
      navigate(from, { replace: true });
    }
  }, [location.state, user, navigate, from]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!usuario.trim()) {
      setError('Por favor ingresa un usuario');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    // Simulación de autenticación para CLIENTES solamente
    // Este formulario es para clientes. Admin usa su propio formulario en /admin/productos
    // No permitir que admin se loguee aquí
    if (usuario === 'admin') {
      setError('Los administradores deben ingresar por el candado (🔒)');
      return;
    }

    if (password === '1234') {
      registrarUsuario(usuario, 'cliente');
      setTimeout(() => navigate(from, { replace: true }), 50);
      return;
    }

    setError('Credenciales incorrectas. Usa cualquier usuario con contraseña 1234');
  };

  return (
    <div className="registrate-container">
      <form className="registrate-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión - Clientes</h2>
        {(mensajeLogin || location.state?.from) && (
          <div className="mensaje-login" style={{
            color: 'rgb(15, 77, 8)',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(15, 77, 8, 0.1)',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {mensajeLogin || 'Debes iniciar sesión para continuar'}
          </div>
        )}
        {error && <div className="error-mensaje" style={{color: 'red', fontSize: '0.9rem'}}>{error}</div>}
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(event) => {
              setUsuario(event.target.value);
              setError('');
            }}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default InicioSesion;
