// src/contexto/ProductosContexto.jsx
import { createContext, useState, useEffect } from 'react';

export const ProductosContexto = createContext();

export const ProductosProvider = ({ children }) => {
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/productosArray.json')
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo JSON");
        return res.json();
      })
      .then(data => {
        setProductosArray(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setError("Problema al cargar productos. Intente nuevamente");
        setCargando(false);
      });
  }, []);

  return (
    <ProductosContexto.Provider value={{ productosArray, cargando, error }}>
      {children}
    </ProductosContexto.Provider>
  );
};
