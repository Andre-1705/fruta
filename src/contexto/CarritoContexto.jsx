import { createContext, useState } from "react";

export const CarritoContexto = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      // 1. Buscar si el producto ya está en el carrito.
      const productoEnCarrito = carritoActual.find(
        (item) => item.id === producto.id
      );

      // 2. Si ya está, mapeamos el carrito y al encontrarlo,
      // creamos un nuevo objeto de producto con la cantidad incrementada.
      if (productoEnCarrito) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // 3. Si no está, lo agregamos al carrito con cantidad 1.
      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id) => {
    setCarrito((carritoActual) => {
      const productoEnCarrito = carritoActual.find((item) => item.id === id);

      // Si la cantidad es 1, al restar se elimina el producto del carrito.
      if (productoEnCarrito?.cantidad === 1) {
        return carritoActual.filter((item) => item.id !== id);
      }

      // Si es mayor que 1, simplemente se resta uno a la cantidad.
      return carritoActual.map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad - 1 }
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

  return (
    <CarritoContexto.Provider
      value={{
        carrito,
        agregarAlCarrito,
        restarDelCarrito,
        removerDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContexto.Provider>
  );
};
