import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './Registrate.css';


//Inicio de sesión
//Revisar lógica de registro, login, user y cliente


function Registrate() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registrarUsuario } = useAuthContexto();
  const navigate = useNavigate();

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
    if (usuario === 'admin' && password === '1234') {
      registrarUsuario(usuario);
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        navigate('/VistaCarrito');
      }, 100);
    } else {
      // Para usuarios normales, registrarlos como clientes
      registrarUsuario(usuario);
      setTimeout(() => {
        navigate('/VistaCarrito');
      }, 100);
    }
  };

  return (
    <div className="registrate-container">
      <form className="registrate-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión / Registrarse</h2>
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
