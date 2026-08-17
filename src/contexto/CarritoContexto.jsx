import { createContext, useState, useContext, useEffect } from "react";

const CarritoContexto = createContext();

export const CarritoProvider = ({ children }) => {
  // Cargar carrito desde localStorage al iniciar
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem('carrito');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const stock = Number(producto?.stock) || 0;
    if (stock <= 0) {
      console.warn('No se puede agregar producto sin stock al carrito');
      return;
    }

    setCarrito((carritoActual) => {
      const productoEnCarrito = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoEnCarrito) {
        const cantidadActual = Number(productoEnCarrito.cantidad) || 0;
        if (cantidadActual >= stock) {
          console.warn(`No hay mas stock disponible. Disponible: ${stock}, En carrito: ${cantidadActual}`);
          return carritoActual;
        }

        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: cantidadActual + 1 }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id) => {
    setCarrito((carritoActual) => {
      const productoEnCarrito = carritoActual.find((item) => item.id === id);
      const cantidadActual = Number(productoEnCarrito?.cantidad) || 0;
      if (cantidadActual <= 1) {
        return carritoActual.filter((item) => item.id !== id);
      }

      return carritoActual.map((item) =>
        item.id === id
          ? { ...item, cantidad: cantidadActual - 1 }
          : item
      );
    });
  };

  const removerDelCarrito = (id) => {
    setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((acc, item) => {
    return acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 0);
  }, 0);

  return (
    <CarritoContexto.Provider
      value={{
        carrito,
        agregarAlCarrito,
        restarDelCarrito,
        removerDelCarrito,
        vaciarCarrito,
        total,
      }}
    >
      {children}
    </CarritoContexto.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContexto);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export { CarritoContexto };
