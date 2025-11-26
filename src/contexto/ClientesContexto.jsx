// src/contexto/ClientesContexto.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export const ClientesContexto = createContext();

export const ClientesProvider = ({ children }) => {
  const [clientesArray, setClientesArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const usarSupabase = Boolean(supabase);

  // Cargar clientes desde Supabase
  const cargarClientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (usarSupabase) {
        const { data, error: err } = await supabase
          .from('clientes')
          .select('*')
          .order('created_at', { ascending: false });
        if (err) throw err;
        setClientesArray(Array.isArray(data) ? data : []);
      } else {
        setClientesArray([]);
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Problema al cargar clientes. Intente nuevamente');
    } finally {
      setCargando(false);
    }
  }, [usarSupabase]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  // CRUD: Agregar cliente
  const agregarCliente = useCallback(async (cliente) => {
    if (!usarSupabase) return null;

    try {
      // Normalizar email para comparación (lowercase, trim)
      const email = (cliente.email || '').trim().toLowerCase();
      if (!email) throw new Error('Email requerido');

      // 1. Buscar si ya existe por email
      const { data: byEmail } = await supabase
        .from('clientes')
        .select('*')
        .ilike('email', email) // case-insensitive
        .limit(1);

      const existente = Array.isArray(byEmail) && byEmail.length ? byEmail[0] : null;

      // 2. Si existe, retornar sin insertar duplicado
      if (existente) {
        return existente;
      }

      // 3. Insertar nuevo (email normalizado)
      const nuevo = { ...cliente, email };
      const { data, error: errInsert } = await supabase
        .from('clientes')
        .insert([nuevo])
        .select()
        .single();
      if (errInsert) throw errInsert;
      setClientesArray((prev) => [data, ...prev]);
      return data;
    } catch (e) {
      console.error('Error al agregar cliente:', e);
      throw e;
    }
  }, [usarSupabase]);

  // CRUD: Actualizar cliente
  const actualizarCliente = useCallback(async (id, cliente) => {
    if (!usarSupabase) return null;
    const { data, error: err } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();
    if (err) throw err;
    setClientesArray((prev) => prev.map(c => (String(c.id) === String(id) ? data : c)));
    return data;
  }, [usarSupabase]);

  // CRUD: Eliminar cliente
  const eliminarCliente = useCallback(async (id) => {
    if (!usarSupabase) return false;
    const { error: err } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    if (err) throw err;
    setClientesArray((prev) => prev.filter(c => String(c.id) !== String(id)));
    return true;
  }, [usarSupabase]);

  return (
    <ClientesContexto.Provider value={{
      clientesArray,
      cargando,
      error,
      cargarClientes,
      agregarCliente,
      actualizarCliente,
      eliminarCliente,
      usarSupabase,
    }}>
      {children}
    </ClientesContexto.Provider>
  );
};
