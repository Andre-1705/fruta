import { Item } from "../Item/Item"; 

// Definición del componente ItemList. Este componente recibe por props "lista y los estados hoveredId y setHoveredId"

export const ItemList = ({ lista, hoveredId, setHoveredId }) => {

  return (
    <div className="fila">

      {/* Determina si lista tiene elementos, si es así mapea los productos*/}    

      {lista && lista.length > 0 ? (
        lista.map((producto) => (

          <div

            //

            key={producto.id}
            className={`tarjeta ${hoveredId === producto.id ? 'hovered' : ''}`} //
            onMouseEnter={() => setHoveredId(producto.id)} //Activa el hover sobre el id del producto
            onMouseLeave={() => setHoveredId(null)} //Desactiva el hover al indicar que NO HAY NINGUNA TARJETA ACTIVA (null)
        
          >
            <img src={producto.img} alt={producto.nombre} className="imagen"  />

            {/* Contenedor para la información del producto */}
            <div className="info">
              <h2>{producto.nombre}</h2>

              {/* Mostrar descripción solo si está hovered */}
              {hoveredId === producto.id && (
                <p className="descripcion">{producto.descripcion}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="info">No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ItemList;