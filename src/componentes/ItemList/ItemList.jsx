import React from 'react';
import { Item } from '../Item/Item';
import './ItemList.css'; // Si tenés estilos específicos

export const ItemList = ({
  lista,
  hoveredId,
  setHoveredId,
  agregarAlCarrito,
  removerDelCarrito,
  carrito
}) => {

  // Manejo de caso cuando no hay productos

  if (!lista || lista.length === 0) {
    return <p>No hay productos disponibles</p>;
  }

// Mapea la lista de productos y renderiza componente Item para cada uno

  return (
    <div className="item-list">

      {lista.map(producto => (
        <Item
          key={producto.id}
          producto={producto}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          agregarAlCarrito={agregarAlCarrito}
          removerDelCarrito={removerDelCarrito}
          carrito={carrito}
      
          />
      ))}
    </div>
  );
};

export default ItemList;
