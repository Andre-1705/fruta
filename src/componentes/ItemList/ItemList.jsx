import React, { useState } from 'react';
import { Item } from '../Item/Item';
import './ItemList.css';

export const ItemList = ({ lista }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? lista
    : lista.filter(producto =>
        producto.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
      );

 //Filtra productos por categoría. En Productos filtrados guarda la categoría seleccionada

  if (!productosFiltrados || productosFiltrados.length === 0) {
    return <p className="mensaje-vacio">No hay productos disponibles</p>;
  }

 // Manejo de caso cuando no hay productos

// Mapea la lista de productos y renderiza componente Item para cada uno


  return (
    <section className="item-list-section">
      <h1>Cliquear sobre los artículos para ver detalles o comprar</h1>

      <ul className="categorias-lista">
        {['Todas', 'Cítricos', 'Tropicales', 'Frutas secas'].map(categoria => (
          <li
            key={categoria}
            className={categoriaSeleccionada === categoria ? 'seleccionada' : ''}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </li>
        ))}
      </ul>

      <div className="item-list">
        {productosFiltrados.map(producto => (
          <Item key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
};

export default ItemList;
