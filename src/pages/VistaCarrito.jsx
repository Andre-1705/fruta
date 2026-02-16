import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx'; // Asegúrate que el nombre y la ruta son correctos
import { useAuthContexto } from '../contexto/AuthContexto.jsx';
import './VistaCarrito.css'; // Importamos un CSS para los estilos

export default function VistaCarrito() {
  const { carrito, agregarAlCarrito, restarDelCarrito, removerDelCarrito } =
    useContext(CarritoContexto);
  const { user } = useAuthContexto();
  const navigate = useNavigate();

  const totalCarrito = carrito.reduce(
    (acc, prod) => {
      const precio = Number(prod.precio) || 0;
      const cantidad = Number(prod.cantidad) || 0;
      return acc + (precio * cantidad);
    },
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
          {carrito.map((producto) => {
            const cantidad = Number(producto.cantidad) || 0;
            const precio = Number(producto.precio) || 0;
            const stock = Number(producto.stock) || 0;
            const subtotal = (precio * cantidad).toFixed(2);
            const enLimititeStock = cantidad >= stock && stock > 0;
            const sinStock = stock <= 0;

            return (
              <div key={producto.id} className="item-carrito">
                <img src={producto.img} alt={producto.nombre} className="item-carrito-img" />

                <div style={{ flex: 1 }}>
                  <span className="item-carrito-nombre">{producto.nombre}</span>

                  {/* Mostrar stock disponible */}
                  <div style={{ fontSize: '0.85rem', color: sinStock ? '#dc2626' : enLimititeStock ? '#ea580c' : '#6b7280', marginTop: '4px' }}>
                    {sinStock ? (
                      <strong>❌ SIN STOCK</strong>
                    ) : enLimititeStock ? (
                      <strong>⚠️ Cantidad máxima alcanzada (disponible: {stock})</strong>
                    ) : (
                      <>📦 Stock disponible: {stock}</>
                    )}
                  </div>
                </div>

                <div className="control-cantidad">
                  <button
                    onClick={() => restarDelCarrito(producto.id)}
                    disabled={sinStock}
                  >
                    -
                  </button>

                  <span>{cantidad}</span>

                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={sinStock || enLimititeStock}
                  >
                    +
                  </button>
                </div>

                <span className="item-carrito-subtotal">${subtotal}</span>

                <button className="btn-quitar" onClick={() => removerDelCarrito(producto.id)}>Quitar</button>
              </div>
            );
          })}
          <p className="total-carrito">Total del carrito: ${totalCarrito.toFixed(2)}</p>
          {/* Si no hay usuario, el botón Pagar pedirá iniciar sesión */}
          {!user ? (
            <button
              className="bton-pagar"
              onClick={() => navigate('/login', { state: { from: '/VistaCarrito' } })}
            >
              Iniciar sesión para pagar
            </button>
          ) : (
            <button
              className="bton-pagar"
              onClick={() => navigate('/checkout')}
            >
              Finalizar Compra
            </button>
          )}
        </>
      )}
    </div>
  );
}
