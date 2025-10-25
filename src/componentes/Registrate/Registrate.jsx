import React,  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';

//revisar lógica de registro

function Registrate() {
  const [ usuario, setUsuario ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate();
  const { registrarUsuario } = useAuthContexto();


const enviarFormulario = (evento) => {
  evento.preventDefault();

    if(usuario && password) {
    // registrarUsuario en AuthContexto marca al usuario como cliente
    registrarUsuario(usuario);
    navigate('/dashboard');
  } else {
    alert('Completa todos los campos');
  }
};

return(
  <form onSubmit={enviarFormulario}>
    <h2>Registrarse</h2>
      <div>
        <label>Usuario:</label>
        <input
          type="text"
          value={usuario}
          onChange={(evento) => setUsuario(evento.target.value)}
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={ (evento) => setPassword(evento.target.value)}
        />
      </div>
      <button type="submit">Crear Cuenta</button>
  </form>
  );
};
export default Registrate;
