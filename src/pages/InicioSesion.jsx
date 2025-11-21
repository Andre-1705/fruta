import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './Registrate.css'; // Reutilizamos estilos

// Página dedicada de Inicio de Sesión
function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modo, setModo] = useState('login'); // login | signup
  const [loading, setLoading] = useState(false);
  const [mensajeLogin, setMensajeLogin] = useState('');
  const { user, login, signUp } = useAuthContexto();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim()) return setError('Por favor ingresa un email');
    if (!password.trim()) return setError('Por favor ingresa una contraseña');
    try {
      setLoading(true);
      if (modo === 'login') {
        await login({ email, password });
      } else {
        await signUp({ email, password });
      }
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrate-container">
      <form className="registrate-form" onSubmit={handleSubmit}>
        <h2>{modo === 'login' ? 'Iniciar Sesión' : 'Crear cuenta'}</h2>
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
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
        <button type="submit" disabled={loading}>{loading ? 'Procesando...' : (modo === 'login' ? 'Ingresar' : 'Crear cuenta')}</button>
        <button type="button" onClick={() => setModo(modo === 'login' ? 'signup' : 'login')} style={{marginLeft:'0.5rem'}}>
          {modo === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'}
        </button>
      </form>
    </div>
  );
}

export default InicioSesion;
