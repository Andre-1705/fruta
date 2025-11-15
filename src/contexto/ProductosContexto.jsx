// src/contexto/ProductosContexto.jsx
import { createContext, useState, useEffect, useCallback } from 'react';

export const ProductosContexto = createContext();



export const ProductosProvider = ({ children }) => {
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de API mock y fallback a JSON local
  // Permitimos 2 nombres posibles para la variable para evitar confusiones: VITE_MOCKAPI_BASE o VITE_MOCKAPI_URL
  const API_BASE_RAW = import.meta.env.VITE_MOCKAPI_BASE || import.meta.env.VITE_MOCKAPI_URL;
  const API_BASE_VAR_NAME = import.meta.env.VITE_MOCKAPI_BASE ? 'VITE_MOCKAPI_BASE' : (import.meta.env.VITE_MOCKAPI_URL ? 'VITE_MOCKAPI_URL' : 'NINGUNA');
  const API_BASE = API_BASE_RAW ? String(API_BASE_RAW).trim() : '';
  const API_BASE_CLEAN = API_BASE.replace(/\/+$/, '');
  const usarApiRemota = Boolean(API_BASE_CLEAN);

  if (!usarApiRemota) {
    console.warn('[ProductosContexto] API remota NO configurada. Variable detectada:', API_BASE_VAR_NAME, 'Valor bruto:', API_BASE_RAW);
    console.warn('[ProductosContexto] Trim ->', API_BASE, ' / limpio ->', API_BASE_CLEAN);
    console.warn('[ProductosContexto] Pasos: 1) Verifica .env en raíz, 2) Usa VITE_MOCKAPI_BASE=URL, 3) Reinicia servidor, 4) No pongas comillas, 5) No dejes espacios antes/después.');
  } else {
    console.log('[ProductosContexto] API remota configurada usando', API_BASE_VAR_NAME, '->', API_BASE_CLEAN);
  }


//Con provider cualquier componente hijo accede a datos relacionados
//con productos sin necesidad de pasar props manualmente
//Chau props!

//fetch futura Api

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (usarApiRemota) {
        const res = await fetch(`${API_BASE_CLEAN}/productos`);
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
  }, [API_BASE_CLEAN, usarApiRemota]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // CRUD contra API remota (si no hay API, no-ops para mantener compatibilidad)
  const agregarProducto = useCallback(async (producto) => {
    if (!usarApiRemota) {
      console.warn('agregarProducto: API no configurada, operación omitida');
      return null;
    }
    const res = await fetch(`${API_BASE_CLEAN}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`No se pudo crear el producto (HTTP ${res.status}). Respuesta: ${txt.substring(0,120)}`);
    }
    const creado = await res.json();
    setProductosArray((prev) => [creado, ...prev]);
    return creado;
  }, [API_BASE_CLEAN, usarApiRemota]);

  const actualizarProducto = useCallback(async (id, producto) => {
    if (!usarApiRemota) {
      console.warn('actualizarProducto: API no configurada, operación omitida');
      return null;
    }
    const res = await fetch(`${API_BASE_CLEAN}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`No se pudo actualizar el producto (HTTP ${res.status}). Respuesta: ${txt.substring(0,120)}`);
    }
    const actualizado = await res.json();
    setProductosArray((prev) => prev.map(p => (String(p.id) === String(id) ? actualizado : p)));
    return actualizado;
  }, [API_BASE_CLEAN, usarApiRemota]);

  const eliminarProducto = useCallback(async (id) => {
    if (!usarApiRemota) {
      console.warn('eliminarProducto: API no configurada, operación omitida');
      return false;
    }
    const res = await fetch(`${API_BASE_CLEAN}/productos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`No se pudo eliminar el producto (HTTP ${res.status}). Respuesta: ${txt.substring(0,120)}`);
    }
    setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
    return true;
  }, [API_BASE_CLEAN, usarApiRemota]);

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
      apiBase: API_BASE_CLEAN,
      apiBaseVarName: API_BASE_VAR_NAME,
    }}>
      {children}
    </ProductosContexto.Provider>
  );
};
