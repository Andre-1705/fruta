import React from 'react';
import { Item } from '../Item/Item';
import './ItemList.css';

export const ItemList = ({ lista, categoria }) => {
  if (!lista || lista.length === 0) {
    return <p className="mensaje-vacio">No hay productos disponibles</p>;
  }

// Reveer el filtrado por experiencia del usuario versus filtrado por url
// categorías con sus propias url
// filtrado por url permite compartir enlaces directos de cada categoría
// Manejo de caso cuando no hay productos
// Mapea la lista de productos y renderiza componente Item para cada uno


  return (
    <section className="item-list-section">
      <h1></h1>

      <div className="item-list">
        {lista.map(producto => (
          <Item
            key={producto.id}
            producto={producto} />
        ))}
      </div>
    </section>
  );
};

export default ItemList;
