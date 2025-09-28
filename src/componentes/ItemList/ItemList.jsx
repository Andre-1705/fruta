import { Item } from "../Item/Item";

// Componente que recibe una lista de productos y maneja el hover
export const ItemList = ({ lista, hoveredId, setHoveredId, agregarAlCarrito }) => {
  console.log(lista);
  return (
    <div className="fila">
      {lista && lista.length > 0 ? (
        lista.map((producto) => (
          <Item
            key={producto.id}
            producto={producto}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))
      ) : (
        <p className="info">No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ItemList;