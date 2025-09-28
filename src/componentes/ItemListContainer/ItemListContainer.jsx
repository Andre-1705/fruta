import { ItemList } from "../ItemList/ItemList";
import { useState } from "react";
import './ItemListContainer.css';

export const ItemListContainer = ({
  titulo,
  productosArray,
  carrito,
  agregarAlCarrito,
  removerDelCarrito
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="fila">
      <h1>{titulo}</h1>

      <ItemList
        lista={productosArray}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
        carrito={carrito}
      />
    </section>
  );
};

export default ItemListContainer;