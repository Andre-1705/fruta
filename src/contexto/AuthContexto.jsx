import React, { createContext, useState, useContext, useEffect } from 'react';
// Crear el contexto de autenticación
const AuthContexto = createContext(null);

export function AuthProvider({ children }) {
  // Inicializamos el estado del usuario leyendo desde localStorage
  // null si no hay usuario logueado

  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('user') || null;
    } catch (e) {
      return null;
    }
  });

  // Rol del usuario: 'cliente' | 'admin' | null
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('role') || null;
    } catch (e) {
      return null;
    }
  });

  // flag que indica si el usuario es cliente registrado o no
  // Separo por rol usuario de cliente registrado lo que permite
  // diferenciar entre un visitante admin de un cliente e impactarlo
  // en el sector de pago

  const [isCliente, setIsCliente] = useState(() => {
    try {
      return localStorage.getItem('isCliente') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Efecto para sincronizar el estado con localStorage cada vez que el usuario o isCliente cambian
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', user);
      } else {
        localStorage.removeItem('user');
      }
      if (role) {
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('role');
      }
      if (isCliente) {
        localStorage.setItem('isCliente', 'true');
      } else {
        localStorage.removeItem('isCliente');
      }
    } catch (e) {
      // ignore storage errores
    }
  }, [user, role, isCliente]);

  const login = (username, rol = null) => {
    // Login simple con rol opcional
    setUser(username);
    if (rol) {
      setRole(rol);
      setIsCliente(rol === 'cliente');
    }
  };

  const logout = () => {
    setUser(null);
    setIsCliente(false);
    setRole(null);
  };

  // Registrar al usuario como cliente (setea user y marca isCliente=true)
  const registrarUsuario = (username, rol = 'cliente') => {
    setUser(username);
    setRole(rol);
    setIsCliente(rol === 'cliente');
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContexto.Provider value={{ user, role, isAdmin, isCliente, login, logout, registrarUsuario }}>
      {children}
    </AuthContexto.Provider>
  );
}
export const useAuthContexto = () => useContext(AuthContexto);
