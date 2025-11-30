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

  const cargarProductos = useCallback(async (incluirInactivos = false) => {
    setCargando(true);
    setError(null);
    try {
      if (usarSupabase) {
        // Intentar filtrar por activo=true (soft delete). Si la columna no existe, fallback sin filtro
        let data = [];
        let err = null;
        try {
          let query = supabase.from('products').select('*');
          if (!incluirInactivos) {
            query = query.eq('activo', true);
          }
          const resp = await query.order('created_at', { ascending: false });
          data = resp.data;
          err = resp.error;
          if (err) throw err;
        } catch (e) {
          // 42703: undefined_column (columna no existe)
          const code = e?.code || e?.details || '';
          if (String(code).includes('42703') || String(e?.message || '').toLowerCase().includes('column') ) {
            const fallback = await supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false });
            if (fallback.error) throw fallback.error;
            data = fallback.data;
          } else {
            throw e;
          }
        }
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

  // Validar SKU único (incluye activos e inactivos)
  const validarSkuUnico = useCallback(async (sku, idExcluir = null) => {
    if (!usarSupabase || !sku) return true;
    try {
      let query = supabase.from('products').select('id, sku, activo').eq('sku', sku);
      if (idExcluir) {
        query = query.neq('id', idExcluir);
      }
      const { data, error: err } = await query;
      if (err) throw err;
      return !data || data.length === 0;
    } catch (e) {
      console.warn('No se pudo validar SKU:', e);
      return true; // fallback: permitir si falla validación
    }
  }, [usarSupabase]);

  // CRUD contra API remota (si no hay API, no-ops para mantener compatibilidad)
  const agregarProducto = useCallback(async (producto) => {
    if (!usarApiRemota) return null;
    if (usarSupabase) {
      // Validar SKU único
      if (producto.sku) {
        const skuValido = await validarSkuUnico(producto.sku);
        if (!skuValido) {
          throw new Error(`El SKU "${producto.sku}" ya está en uso. Elegí otro SKU o restaurá el producto existente.`);
        }
      }
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
      try {
        // Validar SKU único (excluir el producto actual)
        if (producto.sku) {
          const skuValido = await validarSkuUnico(producto.sku, id);
          if (!skuValido) {
            throw new Error(`El SKU "${producto.sku}" ya está en uso por otro producto.`);
          }
        }
        const { data, error: err } = await supabase
          .from('products')
          .update(producto)
          .eq('id', id)
          .select()
          .single();
        if (err) throw err;
        setProductosArray((prev) => prev.map(p => (String(p.id) === String(id) ? data : p)));
        return data;
      } catch (e) {
        console.error('Error actualizando producto en Supabase:', {
          id,
          keys: Object.keys(producto || {}),
          code: e?.code,
          message: e?.message,
          details: e?.details,
          hint: e?.hint,
        });
        const notFound = String(e?.message || '').toLowerCase().includes('no rows') || String(e?.details || '').toLowerCase().includes('results contain 0 rows') || String(e?.code || '').includes('PGRST116');
        const msg = notFound
          ? 'Este producto ya no existe o fue eliminado. Creá uno nuevo.'
          : (e?.message || e?.details || 'No se pudo guardar el producto');
        throw new Error(msg);
      }
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
      // Soft delete: set activo=false. Si la columna no existe, fallback a delete.
      try {
        const { error: updErr } = await supabase
          .from('products')
          .update({ activo: false })
          .eq('id', id);
        if (updErr) throw updErr;
        setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
        return true;
      } catch (e) {
        const code = e?.code || e?.details || '';
        const isNoColumn = String(code).includes('42703') || String(e?.message || '').toLowerCase().includes('column');
        if (!isNoColumn) {
          // Si no es por columna inexistente, propagar (p.ej. otros errores)
          throw e;
        }
        // Fallback a hard delete si no existe la columna
        const { error: delErr } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
        setProductosArray((prev) => prev.filter(p => String(p.id) !== String(id)));
        return true;
      }
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

  const restaurarProducto = useCallback(async (id) => {
    if (!usarApiRemota) return false;
    if (usarSupabase) {
      try {
        const { data, error: err } = await supabase
          .from('products')
          .update({ activo: true })
          .eq('id', id)
          .select()
          .single();
        if (err) throw err;
        // Agregar al array si no está, o actualizar si está
        setProductosArray((prev) => {
          const existe = prev.find(p => String(p.id) === String(id));
          if (existe) {
            return prev.map(p => String(p.id) === String(id) ? data : p);
          }
          return [data, ...prev];
        });
        return true;
      } catch (e) {
        console.error('Error restaurando producto:', e);
        throw e;
      }
    }
    return false;
  }, [usarApiRemota, usarSupabase]);

  return (
    <ProductosContexto.Provider value={{
      productosArray,
      cargando,
      error,
      cargarProductos,
      agregarProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProducto,
      validarSkuUnico,
      usarApiRemota,
    }}>
      {children}
    </ProductosContexto.Provider>
  );
};
