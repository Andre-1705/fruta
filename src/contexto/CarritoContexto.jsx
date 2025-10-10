// src/context/CarritoContext.jsx
import { createContext, useState } from 'react';

// 1. Creamos el contexto
export const CarritoContexto = createContext();

// 2. Creamos el proveedor
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // 3. Función para agregar productos
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => [...prevCarrito, producto]);
  };

  // 4. Función para eliminar productos
  const eliminarDelCarrito = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  // 5. Valor que se comparte con toda la app
  const valorContexto = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito
  };

  // 6. Retornamos el proveedor con el valor y los hijos
  return (
    <CarritoContexto.Provider value={valorContexto}>
      {children}
    </CarritoContexto.Provider>
  );
};
