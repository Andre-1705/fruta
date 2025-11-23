import React from 'react';
import { Item } from '../Item/Item.jsx';
import { Link } from 'react-router-dom';
import './ItemList.css';

export const ItemList = ({ lista }) => {

// Reveer el filtrado por experiencia del usuario versus filtrado por url
// categorías con sus propias url
// filtrado por url permite compartir enlaces directos de cada categoría
// Manejo de caso cuando no hay productos
// Mapea la lista de productos y renderiza componente Item para cada uno


  return (
    <section className="item-list-section">

      <div className="item-list">
        {lista.length ? (
           lista.map((producto) => (
            <Link to={`/producto/${producto.sku || producto.id}`}
              key={producto.sku || producto.id}>
              <Item producto={producto} />
              </Link>
              ))
        ) : (
          <p>No hay productos disponibles</p>
      )}
      </div>

    </section>
  );
};

export default ItemList;
