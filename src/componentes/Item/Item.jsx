import './Item.css';

export const Item = ({ producto, hoveredId, setHoveredId, agregarAlCarrito }) => {
  const estaHovered = hoveredId === producto.id;

  return (
    <article
      className={`tarjeta ${estaHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHoveredId(producto.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <img src={producto.img} alt={producto.nombre} className="imagen" />

      <div className="info">
        <h2>{producto.nombre}</h2>
        <p>Precio: ${producto.precio}</p>

        {estaHovered && (
          <p className="descripcion">{producto.descripcion}</p>
        )}

        <button onClick={() => agregarAlCarrito(producto)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
};

export default Item;