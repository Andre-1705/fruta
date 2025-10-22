import { useContext } from 'react';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx'; // Asegúrate que el nombre y la ruta son correctos
import './VistaCarrito.css'; // Importamos un CSS para los estilos

export default function VistaCarrito() {
  const { carrito, agregarAlCarrito, restarDelCarrito, removerDelCarrito } =
    useContext(CarritoContexto);

  const totalCarrito = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );

// restar del carrito vs. quitar del carrito vs. remover del carrito
// precio por cantidad con redondeo a 2 decimales

  return (
    <div className="carrito">
      <h2>Revisa cómo esta quedando tu carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          {carrito.map((producto) => (
            <div key={producto.id} className="item-carrito">
              <img src={producto.img} alt={producto.nombre} className="item-carrito-img" />

              <span className="item-carrito-nombre">{producto.nombre}</span>
              <div className="control-cantidad">

                <button onClick={() => restarDelCarrito(producto.id)}>-</button>

                <span>{producto.cantidad}</span>

                <button onClick={() => agregarAlCarrito(producto)}>+</button>

              </div>

              <span className="item-carrito-subtotal">${(producto.precio * producto.cantidad).toFixed(2)}</span>

              <button className="btn-quitar" onClick={() => removerDelCarrito(producto.id)}>Quitar</button>
            </div>
          ))}
          <p className="total-carrito">Total del carrito: ${totalCarrito.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}
