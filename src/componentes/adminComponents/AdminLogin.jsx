import React, { useState } from 'react';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

// Formulario exclusivo para autenticación de administrador
// Credenciales esperadas (prototipo): admin / 1234
export default function AdminLogin() {
  const { registrarUsuario, user, isAdmin } = useAuthContexto();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const destino = location.pathname || '/admin/productos';

  if (user && isAdmin) {
    // Ya autenticado como admin
    return null; // AdminRoute renderizará children
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Complete usuario y contraseña');
      return;
    }
    if (username === 'admin' && password === '1234') {
      registrarUsuario(username, 'admin');
      setTimeout(() => navigate(destino, { replace: true }), 50);
    } else {
      setError('Usuario no autorizado');
    }
  };

  return (
    <div style={{maxWidth:'360px',margin:'2rem auto',padding:'1.25rem',border:'1px solid #ccc',borderRadius:'8px',background:'#fafafa'}}>
      <h3 style={{marginTop:0,textAlign:'center'}}>Acceso Administrador</h3>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        <label style={{display:'flex',flexDirection:'column',fontSize:'0.9rem'}}>Usuario
          <input value={username} onChange={(e)=>{setUsername(e.target.value);setError('');}} required />
        </label>
        <label style={{display:'flex',flexDirection:'column',fontSize:'0.9rem'}}>Contraseña
          <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value);setError('');}} required />
        </label>
        {error && <div style={{color:'crimson',fontSize:'0.85rem',textAlign:'center'}}>{error}</div>}
        <button type="submit" style={{padding:'0.6rem',background:'#157347',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>Ingresar</button>
      </form>
      <p style={{fontSize:'0.7rem',marginTop:'0.75rem',textAlign:'center',color:'#555'}}>Solo personal autorizado. Intentos inválidos mostrarán "Usuario no autorizado".</p>
    </div>
  );
}
