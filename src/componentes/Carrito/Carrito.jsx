import "./Carrito.css";

// Componente que muestra los productos añadidos al carrito y el total acumulado
export const Carrito = ({ carrito, removerDelCarrito }) => {
  const obtenerTotal = () => {
    return carrito.reduce((total, producto) =>
      total + (producto.precio * (producto.cantidad || 0)), 0);
  };

  return (
    <div className="carrito">
      <h2>Carrito</h2>

      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {carrito.map(producto => (
            <div key={producto.id} className="carrito-producto">
              <span>Producto: {producto.nombre}</span>
              <span>Cantidad: {producto.cantidad}</span>
              <span>Precio $: {producto.precio}</span>
              <span>Total: $ {producto.precio * producto.cantidad}</span>
              <button onClick={() => removerDelCarrito(producto.id)}>Eliminar</button>
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
