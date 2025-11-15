import React, { useState } from 'react';
import { useAuthContexto } from '../../contexto/AuthContexto.jsx';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';
import { useContext } from 'react';
import ProductoForm from './ProductoForm.jsx';
import { useAdminProductos } from './useAdminProductos.js';

// Panel de administración de productos
// Requiere que el usuario esté logueado (podrías extender a rol admin más adelante)

export default function ProductosAdminPanel() {
  const { user, isAdmin } = useAuthContexto();
  const { productosArray, cargando, error, eliminarProducto, usarApiRemota } = useContext(ProductosContexto);
  const { crearProducto, editarProducto, subirImagenEnProgreso } = useAdminProductos();

  const [editando, setEditando] = useState(null); // producto en edición
  const [creando, setCreando] = useState(false); // flag para mostrar formulario nuevo
  const [guardando, setGuardando] = useState(false);

  if (!user) {
    return <p>Debes iniciar sesión para administrar productos</p>;
  }
  if (!isAdmin) {
    return <p>No autorizado</p>;
  }

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
      <h2>Administración de Productos</h2>
      {!usarApiRemota && (
        <p style={{color: 'orange'}}>API remota no configurada. Sólo lectura desde JSON local.</p>
      )}
      {error && <p style={{color:'red'}}>{error}</p>}
      {cargando && <p>Cargando productos...</p>}

      {!creando && !editando && usarApiRemota && (
        <button onClick={() => setCreando(true)}>Nuevo Producto</button>
      )}

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
    </div>
  );
}
