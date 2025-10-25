import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './Registrate.css';


//Inicio de sesión
//Revisar lógica de registro, login, user y cliente


function Registrate() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { registrarUsuario } = useAuthContexto();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulación de autenticación
    if (usuario === 'admin' && password === '1234') {
      registrarUsuario(usuario);
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        navigate('/VistaCarrito');
      }, 100);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="registrate-container">
      <form className="registrate-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Registrate;
