import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './Registrate.css';


//Inicio de sesión
//Revisar lógica de registro, login, user y cliente


function Registrate() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensajeLogin, setMensajeLogin] = useState('');
  const { registrarUsuario, user, isCliente } = useAuthContexto();
  const navigate = useNavigate();
  const location = useLocation();

  // Si viene de una ruta protegida, mostrar mensaje
  useEffect(() => {
    // Verificar si viene de una ruta protegida (carrito, dashboard, etc)
    const fromProtectedRoute = location.state?.from === '/VistaCarrito' || 
                                location.state?.from === '/dashboard' ||
                                location.state?.from;
    
    if (fromProtectedRoute) {
      setMensajeLogin('Debes iniciar sesión para acceder al carrito');
    }
    
    // Solo redirigir si ya está logueado Y no viene de una ruta protegida
    // (para evitar loops infinitos)
    if (user && isCliente && !fromProtectedRoute) {
      navigate('/VistaCarrito', { replace: true });
    }
  }, [location.state, user, isCliente, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Limpiar error previo

    // Validaciones básicas
    if (!usuario.trim()) {
      setError('Por favor ingresa un usuario');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    // Simulación de autenticación (lógica de login)
    // Si es admin con la contraseña correcta, permitir acceso
    if (usuario === 'admin' && password === '1234') {
      registrarUsuario(usuario);
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        navigate('/VistaCarrito');
      }, 100);
    } else {
      // Si las credenciales no son correctas, mostrar error
      setError('Credenciales incorrectas. Usa admin/1234 para iniciar sesión');
    }
  };

  return (
    <div className="registrate-container">
      <form className="registrate-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión / Registrarse</h2>
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
            {mensajeLogin || 'Debes iniciar sesión para acceder al carrito'}
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
              setError(''); // Limpiar error al escribir
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
              setError(''); // Limpiar error al escribir
            }}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Registrate;
