import './Item.css';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CarritoContexto } from '../../contexto/CarritoContexto';


export const Item = ({ producto }) => {
  const { carrito, agregarAlCarrito, removerDelCarrito } = useContext(CarritoContexto);
  const [estaHovered, setEstaHovered] = useState(false);

  const enCarrito = carrito.some(item => item.id === producto.id);

// Item va a ser la variable producto adentro del carrito para comparar con el id del producto externo
// con el nuevo que aparece
// Verifica con some si el producto ya está en el carrito
// Propagation maneja el evento para que no se propague al hacer click en los botones

  const handleAgregar = (evento) => {
    evento.stopPropagation();
    agregarAlCarrito(producto);
  };

  const handleRemover = (evento) => {
    evento.stopPropagation();
    removerDelCarrito(producto.id);
  };

  // El hovered se aplica sobre la clase tarjeta
  // Link te dirige hacia producto.id

  return (

    <Link to={`/producto/${producto.id}`} className="item-link">
      <article
        className={`tarjeta ${estaHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setEstaHovered(true)}
        onMouseLeave={() => setEstaHovered(false)}
      >
        <img src={producto.img} alt={producto.nombre} className="imagen" />

        <div className="info">
          <h2>{producto.nombre}</h2>
          <p>Precio: ${producto.precio}</p>

          {estaHovered && (
            <p className="descripcion">{producto.descripcion}</p>
          )}

          {enCarrito ? (
            <button onClick={handleRemover}>
              Quitar del carrito
            </button>
          ) : (
            <button onClick={handleAgregar}>
              Agregar al carrito
            </button>
          )}

        </div>
      </article>
    </Link>

  );
};
export default Item;
