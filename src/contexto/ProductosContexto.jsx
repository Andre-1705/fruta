// src/contexto/ProductosContexto.jsx
import { createContext, useState, useEffect, useCallback } from 'react';

export const ProductosContexto = createContext();



export const ProductosProvider = ({ children }) => {
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de API mock y fallback a JSON local
  const API_BASE = import.meta?.env?.VITE_MOCKAPI_BASE || '';
  const usarApiRemota = Boolean(API_BASE);


//Con provider cualquier componente hijo accede a datos relacionados
//con productos sin necesidad de pasar props manualmente
//Chau props!

//fetch futura Api

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (usarApiRemota) {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error('Error al obtener productos de la API');
        const data = await res.json();
        setProductosArray(Array.isArray(data) ? data : []);
      } else {
        // Fallback local JSON
        const res = await fetch('/data/productosArray.json');
        if (!res.ok) throw new Error('No se pudo cargar el archivo JSON');
        const data = await res.json();
        setProductosArray(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Problema al cargar productos. Intente nuevamente');
    } finally {
      setCargando(false);
    }
  }, [API_BASE, usarApiRemota]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // CRUD contra API remota (si no hay API, no-ops para mantener compatibilidad)
  const agregarProducto = useCallback(async (producto) => {
    if (!usarApiRemota) {
      console.warn('agregarProducto: API no configurada, operación omitida');
      return null;
    }
    const res = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) throw new Error('No se pudo crear el producto');
    const creado = await res.json();
    setProductosArray((prev) => [creado, ...prev]);
    return creado;
  }, [API_BASE, usarApiRemota]);

  const actualizarProducto = useCallback(async (id, producto) => {
    if (!usarApiRemota) {
      console.warn('actualizarProducto: API no configurada, operación omitida');
      return null;
    }
    const res = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });

    if (!res.ok) throw new Error('No se pudo actualizar el producto');
    const actualizado = await res.json();
    setProductosArray((prev) => prev.map(p => (String(p.id) === String(id) ? actualizado : p)));
    return actualizado;
  }, [API_BASE, usarApiRemota]);

  const eliminarProducto = useCallback(async (id) => {
    if (!usarApiRemota) {
      console.warn('eliminarProducto: API no configurada, operación omitida');
      return false;
    }
    const res = await fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar el producto');
    setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
    return true;
  }, [API_BASE, usarApiRemota]);

  return (
    <ProductosContexto.Provider value={{
      productosArray,
      cargando,
      error,
      cargarProductos,
      agregarProducto,
      actualizarProducto,
      eliminarProducto,
      usarApiRemota,
    }}>
      {children}
    </ProductosContexto.Provider>
  );
};
