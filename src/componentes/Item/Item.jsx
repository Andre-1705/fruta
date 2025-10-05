import './Item.css';

export const Item = ({
  producto,
  hoveredId,
  setHoveredId,
  agregarAlCarrito,
  removerDelCarrito,
  carrito
}) => {
  const estaHovered = hoveredId === producto.id;
  const enCarrito = carrito.some(item => item.id === producto.id);

// Maneja el evento para que no se propague al hacer click en los botones

  const handleAgregar = (eventoClick) => {
    eventoClick.stopPropagation();
    agregarAlCarrito(producto);
  };

  const handleRemover = (eventoClick) => {
    eventoClick.stopPropagation();
    removerDelCarrito(producto.id);
  };

  return (
    <article
      className={`tarjeta ${estaHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHoveredId(producto.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => agregarAlCarrito(producto)}
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
  );
};

export default Item;
