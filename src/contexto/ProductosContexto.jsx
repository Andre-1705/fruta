/* eslint-disable react-refresh/only-export-components */
// src/contexto/ProductosContexto.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export const ProductosContexto = createContext();



export const ProductosProvider = ({ children }) => {
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de orígenes de datos
  // 1) Supabase (si está configurado) 2) MockAPI (si está configurado) 3) JSON local (fallback)
  const API_BASE_RAW = import.meta.env.VITE_MOCKAPI_BASE || import.meta.env.VITE_MOCKAPI_URL;
  const API_BASE = API_BASE_RAW ? String(API_BASE_RAW).trim() : '';
  const API_BASE_CLEAN = API_BASE.replace(/\/+$/, '');
  const usarMockApi = Boolean(API_BASE_CLEAN);
  const usarSupabase = Boolean(supabase);
  // Bandera unificada para el admin hook: hay backend remoto disponible
  const usarApiRemota = usarSupabase || usarMockApi;


//Con provider cualquier componente hijo accede a datos relacionados
//con productos sin necesidad de pasar props manualmente
//Chau props!

//fetch futura Api

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (usarSupabase) {
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (err) throw err;
        setProductosArray(Array.isArray(data) ? data : []);
      } else if (usarMockApi) {
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
  }, [API_BASE_CLEAN, usarSupabase, usarMockApi]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // CRUD contra API remota (si no hay API, no-ops para mantener compatibilidad)
  const agregarProducto = useCallback(async (producto) => {
    if (!usarApiRemota) return null;
    if (usarSupabase) {
      const { data, error: err } = await supabase
        .from('products')
        .insert([producto])
        .select()
        .single();
      if (err) throw err;
      setProductosArray((prev) => [data, ...prev]);
      return data;
    }
    // MockAPI
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
  }, [API_BASE_CLEAN, usarApiRemota, usarSupabase]);

  const actualizarProducto = useCallback(async (id, producto) => {
    if (!usarApiRemota) return null;
    if (usarSupabase) {
      const { data, error: err } = await supabase
        .from('products')
        .update(producto)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      setProductosArray((prev) => prev.map(p => (String(p.id) === String(id) ? data : p)));
      return data;
    }
    // MockAPI
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
  }, [API_BASE_CLEAN, usarApiRemota, usarSupabase]);

  const eliminarProducto = useCallback(async (id) => {
    if (!usarApiRemota) return false;
    if (usarSupabase) {
      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (err) throw err;
      setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
      return true;
    }
    // MockAPI
    const res = await fetch(`${API_BASE_CLEAN}/productos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`No se pudo eliminar el producto (HTTP ${res.status}). Respuesta: ${txt.substring(0,120)}`);
    }
    setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
    return true;
  }, [API_BASE_CLEAN, usarApiRemota, usarSupabase]);

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
