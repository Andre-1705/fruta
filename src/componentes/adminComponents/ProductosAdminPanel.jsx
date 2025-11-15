import React, { useState } from 'react';
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
    try {
      await crearProducto(producto, file);
      setCreando(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEditar = async (producto, file) => {
    if (!editarProducto) return;
    setGuardando(true);
    try {
      await editarProducto(editando.id, producto, file);
      setEditando(null);
    } catch (e) {
      console.error(e);
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

  return (
    <div className="admin-panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h2 style={{margin:0}}>Administración de Productos</h2>
        <button
          onClick={handleLogoutAdmin}
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
          Cerrar sesión Admin
        </button>
      </div>
      {!usarApiRemota && (
        <p style={{color: 'orange'}}>API remota no configurada. Sólo lectura desde JSON local.</p>
      )}
      {error && <p style={{color:'red'}}>{error}</p>}
      {cargando && <p>Cargando productos...</p>}

      {/* El botón inferior abrirá el formulario de gestión de productos */}

      {creando && (
        <ProductoForm
          onSubmit={manejarCrear}
          loading={guardando || subirImagenEnProgreso}
          onCancel={() => setCreando(false)}
        />
      )}

      {editando && (
        <ProductoForm
          initialData={editando}
          onSubmit={manejarEditar}
          loading={guardando || subirImagenEnProgreso}
          onCancel={() => setEditando(null)}
        />
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
          {productosArray.map(p => (
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

      {/* Botón inferior para ingresar al formulario de creación/edición */}
      {!creando && !editando && usarApiRemota && (
        <div style={{marginTop:'1rem', display:'flex', justifyContent:'flex-end'}}>
          <button
            onClick={() => setCreando(true)}
            style={{
              padding:'0.5rem 1rem',
              background:'#0d6efd',
              color:'#fff',
              border:'none',
              borderRadius:'4px',
              cursor:'pointer',
              fontWeight:'bold'
            }}
          >
            Abrir formulario de producto
          </button>
        </div>
      )}
    </div>
  );
}
