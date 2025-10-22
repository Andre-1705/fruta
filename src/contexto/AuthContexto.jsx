import React, { createContext, useState, useContext, useEffect } from 'react';
// Crear el contexto de autenticación
const AuthContexto = createContext(null);

export function AuthProvider({ children }) {
  // Inicializamos el estado del usuario leyendo desde localStorage
  const [user, setUser] = useState(() => localStorage.getItem('user') || null);

  // Efecto para sincronizar el estado con localStorage cada vez que el usuario cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username) => {
    // Simulando la creación de un token
    // const token = `fake-token-${username}`;
    // localStorage.setItem('authToken', token);
    setUser(username);
  };

  const logout = () => {
    // localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContexto.Provider value={{ user, login, logout }}>
      {children}
    </AuthContexto.Provider> );
}
export const useAuthContexto = () => useContext(AuthContexto);
