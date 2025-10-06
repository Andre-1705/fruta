import React from 'react';
import { Item } from '../Item/Item';
import './ItemList.css'; // Si tenés estilos específicos
import { useState } from 'react';

export const ItemList = ({
  lista,
  hoveredId,
  setHoveredId,
  agregarAlCarrito,
  removerDelCarrito,
  carrito,
}) => {

  //Filtra productos por categoría. En Productos filtrados guarda la categoría seleccionada

const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

const productosFiltrados = categoriaSeleccionada === 'Todas'
  ? lista
  : lista.filter(producto =>
      producto.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
    );


  // Manejo de caso cuando no hay productos

  if (!productosFiltrados || productosFiltrados.length === 0) {
    return <p className="mensaje-vacio">No hay productos disponibles</p>;
  }


// Mapea la lista de productos y renderiza componente Item para cada uno

  return (
    <section className="item-list-section">
      <h1>Cliquear sobre los artículos para comprar</h1>

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
    </section>
  );
};

export default ItemList;
