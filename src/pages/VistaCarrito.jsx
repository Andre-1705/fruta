import { useContext } from 'react';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx';

export default function VistaCarrito() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useContext(CarritoContext);

  return (
    <div className="carrito">
      <h2>Revisa cómo está quedando tu carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        carrito.map(producto => (
          <div key={producto.id} className="item-carrito">
            <p>Producto: {producto.nombre}</p>
            <p>Cantidad: {producto.cantidad}</p>
            <p>Precio $: {producto.precio}</p>
            <p>Total: ${producto.precio * producto.cantidad}</p>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar</button>
            <button onClick={() => eliminarDelCarrito(producto.id)}>Eliminar</button>
          </div>
        ))
      )}
      <p>Total del carrito: ${carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)}</p>
    </div>
  );
}

