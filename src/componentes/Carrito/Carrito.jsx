import "./Carrito.css";
import { useContext } from "react";
import { CarritoContexto } from "../../contexto/CarritoContexto";

// Componente que muestra los productos añadidos al carrito y el total acumulado

const Carrito = () => {
  const { carrito, removerDelCarrito, agregarAlCarrito } = useContext(CarritoContexto);

  const obtenerTotal = () => {
    return carrito.reduce((total, producto) =>
      total + (producto.precio * (producto.cantidad || 0)), 0);
  };

  // Mapea los productos del carrito, muestra su información
  //colocamos los botones

  return (
    <div className="carrito">
      <h2>Carrito</h2>

      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {carrito.map(producto => (
            <div key={producto.id} className="carrito-producto">
              <img src={producto.img} alt={`Foto ilustrativa de ${producto.nombre}`} />
              <div className="carrito-detalle">
                <span>Producto: {producto.nombre}</span>
                <span>Cantidad: {producto.cantidad}</span>
                <span>Precio $: {producto.precio}</span>
                <span>Total: $ {producto.precio * producto.cantidad}</span>
                <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
                <button onClick={() => removerDelCarrito(producto.id)}>Eliminar del carrito</button>
              </div>
            </div>
          ))}

          <div className="carrito-total">
            <strong>Total del carrito: ${obtenerTotal()}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
