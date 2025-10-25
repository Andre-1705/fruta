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

  // flag que indica si el usuario es cliente registrado o no
  // Separo usuario de cliente registrado lo que permite
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
      if (isCliente) {
        localStorage.setItem('isCliente', 'true');
      } else {
        localStorage.removeItem('isCliente');
      }
    } catch (e) {
      // ignore storage errores
    }
  }, [user, isCliente]);

  const login = (username) => {
    // Login simple: no cambia isCliente (puede ser un admin o visitante)
    setUser(username);
  };

  const logout = () => {
    setUser(null);
    setIsCliente(false);
  };

  // Registrar al usuario como cliente (setea user y marca isCliente=true)
  const registrarUsuario = (username) => {
    setUser(username);
    setIsCliente(true);
  };

  return (
    <AuthContexto.Provider value={{ user, isCliente, login, logout, registrarUsuario }}>
      {children}
    </AuthContexto.Provider>
  );
}
export const useAuthContexto = () => useContext(AuthContexto);
