/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
// Crear el contexto de autenticación
const AuthContexto = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCliente, setIsCliente] = useState(false);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase?.();

  // Cargar sesión inicial y suscribirse a cambios de auth
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!supabase) return;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        // Si hay error de refresh token, limpiar la sesión corrupta
        if (error) {
          console.warn('Error al obtener sesión, limpiando:', error.message);
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setIsCliente(false);
          }
          return;
        }
        if (mounted) {
          setUser(session?.user || null);
          setIsCliente(!!session?.user && session.user.email?.toLowerCase() !== adminEmail);
        }
      } catch (err) {
        console.error('Error inicializando auth:', err);
        if (mounted) {
          setUser(null);
          setIsCliente(false);
        }
      }
    };
    init();

    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsCliente(!!session?.user && session.user.email?.toLowerCase() !== adminEmail);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [adminEmail]);

  const isAdmin = !!user && user.email?.toLowerCase() === adminEmail;

  const login = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContexto.Provider value={{ user, isAdmin, isCliente, login, logout, signUp }}>
      {children}
    </AuthContexto.Provider>
  );
}
export const useAuthContexto = () => useContext(AuthContexto);
