import { createContext, useState } from "react";

const CarritoContexto = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    // Validar que el producto tenga stock disponible
    const stock = Number(producto?.stock) || 0;
    if (stock <= 0) {
      console.warn('No se puede agregar producto sin stock al carrito');
      return; // No agregar productos sin stock
    }

    setCarrito((carritoActual) => {

      // 1. Buscar si el producto ya está en el carrito
      const productoEnCarrito = carritoActual.find(
        (item) => item.id === producto.id
      );

      // 2. Si ya está, validar que no exceda el stock disponible
      if (productoEnCarrito) {
        const cantidadActual = Number(productoEnCarrito.cantidad) || 0;
        // Si la cantidad actual ya es igual o mayor al stock, no incrementar
        if (cantidadActual >= stock) {
          console.warn(`No hay más stock disponible. Disponible: ${stock}, En carrito: ${cantidadActual}`);
          return carritoActual; // Retornar el carrito sin cambios
        }
        
        // Incrementar la cantidad solo si hay stock disponible
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: cantidadActual + 1 }
            : item
        );
      }

      // 3. Si no está, lo agregamos al carrito con cantidad 1
      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id) => {
    setCarrito((carritoActual) => {
      const productoEnCarrito = carritoActual.find((item) => item.id === id);

      // Si la cantidad es 1 o menos, al restar se elimina el producto del carrito
      const cantidadActual = Number(productoEnCarrito?.cantidad) || 0;
      if (cantidadActual <= 1) {
        return carritoActual.filter((item) => item.id !== id);
      }

      // Si es mayor que 1, simplemente se resta uno a la cantidad
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

export { CarritoContexto };
