import React, { useState } from 'react';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';
import { useLocation } from 'react-router-dom';

// Formulario exclusivo para autenticación de administrador
// Credenciales esperadas (prototipo): admin / 1234
export default function AdminLogin() {
  const { user, isAdmin, login } = useAuthContexto();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase?.();

  if (user && isAdmin) {
    // Ya autenticado como admin, no mostrar formulario
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Completá email y contraseña');
      return;
    }
    if (email.toLowerCase() !== adminEmail) {
      setError('Este correo no tiene permisos de administrador');
      return;
    }
    try {
      setLoading(true);
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:'360px',margin:'2rem auto',padding:'1.25rem',border:'1px solid #ccc',borderRadius:'8px',background:'#fafafa'}}>
      <h3 style={{marginTop:0,textAlign:'center'}}>Acceso Administrador</h3>
      {!adminEmail && (
        <div style={{background:'#fff3cd',border:'1px solid #ffeeba',color:'#856404',padding:'0.6rem',borderRadius:'6px',marginBottom:'0.75rem',fontSize:'0.85rem'}}>
          Falta configurar <code>VITE_ADMIN_EMAIL</code> en el entorno. Defínelo en .env y en Vercel, luego redeploy.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        <label style={{display:'flex',flexDirection:'column',fontSize:'0.9rem'}}>Email
          <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value);setError('');}} required />
        </label>
        <label style={{display:'flex',flexDirection:'column',fontSize:'0.9rem'}}>Contraseña
          <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value);setError('');}} required />
        </label>
        {error && <div style={{color:'crimson',fontSize:'0.85rem',textAlign:'center'}}>{error}</div>}
        <button type="submit" disabled={loading} style={{padding:'0.6rem',background:'#157347',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      <p style={{fontSize:'0.7rem',marginTop:'0.75rem',textAlign:'center',color:'#555'}}>Solo personal autorizado. Intentos inválidos mostrarán "Usuario no autorizado".</p>
    </div>
  );
}
