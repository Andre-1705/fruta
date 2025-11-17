import React, { useState, useMemo } from 'react';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';
import { useContext } from 'react';
import ProductoForm from './ProductoForm.jsx';
import { useAdminProductos } from './useAdminProductos.js';
import { useNavigate } from 'react-router-dom';

// Panel de administración de productos
// Requiere que el usuario esté logueado como admin

export default function ProductosAdminPanel() {
  const { user, isAdmin, logout } = useAuthContexto();
  const { productosArray, cargando, error, eliminarProducto, usarApiRemota } = useContext(ProductosContexto);
  const { crearProducto, editarProducto, subirImagenEnProgreso } = useAdminProductos();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(null); // producto en edición
  const [creando, setCreando] = useState(false); // flag para mostrar formulario nuevo
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [ultimoError, setUltimoError] = useState(null);

  if (!user) {
    return <p>Debes iniciar sesión para administrar productos</p>;
  }
  if (!isAdmin) {
    return <p>No autorizado</p>;
  }

  const handleLogoutAdmin = () => {
    logout();
    navigate('/');
  };

  const manejarCrear = async (producto, file) => {
    if (!crearProducto) return;
    setGuardando(true);
    setUltimoError(null);
    try {
      await crearProducto(producto, file);
      setCreando(false);
    } catch (e) {
      console.error(e);
      setUltimoError(e.message || 'Error al crear');
    } finally {
      setGuardando(false);
    }
  };

  const manejarEditar = async (producto, file) => {
    if (!editarProducto) return;
    setGuardando(true);
    setUltimoError(null);
    try {
      await editarProducto(editando.id, producto, file);
      setEditando(null);
    } catch (e) {
      console.error(e);
      setUltimoError(e.message || 'Error al editar');
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id) => {
    if (!eliminarProducto) return;
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
    } catch (e) {
      console.error(e);
    }
  };

  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productosArray;
    const term = busqueda.toLowerCase();
    return productosArray.filter(p => (
      String(p.nombre).toLowerCase().includes(term) ||
      String(p.categoria).toLowerCase().includes(term)
    ));
  }, [busqueda, productosArray]);

  return (
    <div className="admin-panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h2 style={{margin:0}}>Administración de Productos</h2>
        <button
          onClick={() => {
            console.log('Abrir formulario crear producto');
            setEditando(null);
            setCreando(true);
          }}
          style={{
            padding:'0.5rem 1rem',
            background:'#dc3545',
            color:'#fff',
            border:'none',
            borderRadius:'4px',
            cursor:'pointer',
            fontWeight:'bold'
          }}
        >
          Gestionar Productos
        </button>
      </div>
      <div style={{display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.75rem'}}>
        <input
          type="text"
          placeholder="Buscar por nombre o categoría"
          value={busqueda}
          onChange={(e)=> setBusqueda(e.target.value)}
          style={{flex:'1', padding:'0.45rem 0.6rem', border:'1px solid #ccc', borderRadius:'4px'}}
        />
        {(busqueda || editando || creando) && (
          <button
            type="button"
            onClick={() => { setBusqueda(''); }}
            style={{padding:'0.45rem 0.9rem', background:'#6c757d', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer'}}
          >Limpiar búsqueda</button>
        )}
      </div>
      {!usarApiRemota && (
        <div style={{background:'#fff3cd', border:'1px solid #ffeeba', padding:'0.6rem 0.8rem', borderRadius:'4px', marginBottom:'0.75rem', color:'#856404'}}>
          <p style={{margin:0, fontWeight:600}}>API remota no configurada</p>
          <small>Revisa archivo <code>.env</code> y asegúrate de definir <code>VITE_MOCKAPI_BASE</code> (o <code>VITE_MOCKAPI_URL</code>) y luego reinicia con <code>npm run dev</code>.</small>
        </div>
      )}
      {ultimoError && (
        <div style={{background:'#fff3cd', border:'1px solid #ffeeba', padding:'0.6rem 0.8rem', borderRadius:'4px', marginBottom:'0.75rem', color:'#856404'}}>
          <strong>Atención:</strong> {ultimoError}
        </div>
      )}
      {error && <p style={{color:'red'}}>{error}</p>}
      {cargando && <p>Cargando productos...</p>}

      {/* El botón inferior abrirá el formulario de gestión de productos */}

      {creando && !editando && (
        <div style={{marginTop:'1rem'}}>
          <ProductoForm
            onSubmit={manejarCrear}
            loading={guardando || subirImagenEnProgreso}
            onCancel={() => setCreando(false)}
            onResetToNew={() => { /* si ya estamos en nuevo, limpiar; handle dentro de form */ }}
          />
        </div>
      )}

      {editando && (
        <div style={{marginTop:'1rem'}}>
          <ProductoForm
            initialData={editando}
            onSubmit={manejarEditar}
            loading={guardando || subirImagenEnProgreso}
            onCancel={() => { setEditando(null); setCreando(false); }}
            onDelete={(id) => { manejarEliminar(id); setEditando(null); }}
            onResetToNew={() => { setEditando(null); setCreando(true); }}
          />
        </div>
      )}

      <table className="tabla-productos" style={{width:'100%', marginTop:'1rem', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            {usarApiRemota && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.id} style={{borderBottom:'1px solid #ddd'}}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio}</td>
              <td>{p.stock ?? '-'}</td>
              <td>
                {p.img ? (
                  <img src={p.img} alt={p.nombre} style={{width:'50px', height:'50px', objectFit:'cover'}} />
                ) : '—'}
              </td>
              {usarApiRemota && (
                <td>
                  <button onClick={() => setEditando(p)}>Editar</button>
                  <button onClick={() => manejarEliminar(p.id)} style={{marginLeft:'0.5rem', color:'red'}}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón de cerrar sesión al final */}
      <div style={{marginTop:'2rem', textAlign:'center'}}>
        <button
          onClick={handleLogoutAdmin}
          style={{
            padding:'0.5rem 1.5rem',
            background:'#6c757d',
            color:'white',
            border:'none',
            borderRadius:'4px',
            cursor:'pointer',
            fontWeight:'bold'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
