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

  return (
    <div className="item-list">

      {lista.map(producto => (
        <Item
          key={producto.id}
          id={producto.id}
          nombre={producto.nombre}
          precio={producto.precio}
          imagen={producto.imagen} // si tenés imágenes en el JSON
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
