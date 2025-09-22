// Importación del componente ItemList
import { ItemList } from "../ItemList/ItemList";
import { useState } from "react";
import './ItemListContainer.css';

// Definición del componente ItemListContainer. Este componente recibe "titulo" y "productos" como props.
export const ItemListContainer = ({ titulo, productos }) => {
       const [hoveredId, setHoveredId] = useState(null); 
       // null = ninguna tarjeta activa

    // En un futuro, aquí se podría manejar un estado (por ejemplo, con useState)
    // y hacer una llamada a una API para obtener los productos

    return( 
        // El elemento <seccion> agrupa el contenido relacionado
        <section className="fila">
          {/* Muestra el título que se pasa como prop */}

          <h1>{ titulo }</h1>

          {/* Renderiza el componente ItemList, pasándole la lista de productos como props. Trabajo en el hover*/}
          <ItemList lista={productos} 
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
      />
    </section>
  );
};
export default ItemListContainer;