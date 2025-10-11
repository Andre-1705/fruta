import { useContext } from 'react';
import { CarritoContexto } from '../../contexto/CarritoContexto.jsx';
import './ItemDetail.css';

export const ItemDetail = ({ detail }) => {
  const { agregarAlCarrito } = useContext(CarritoContexto);

  // Verificación de seguridad: si `detail` no existe, no renderizar nada.
  // El contenedor se encargará de mostrar el mensaje de "cargando" o "no encontrado".
  if (!detail) {
    return null;
  }

  const { nombre, precio, descripcion, img, stock } = detail;

  return (
    <div className="detalle-producto">
      <h2>{nombre}</h2>
      <img src={img} alt={nombre} />
      <p>{descripcion}</p>
      <p>Precio: ${precio}</p>
      <p className={stock > 0 ? "stock-ok" : "stock-out"}>
        {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
      </p>

      {stock > 0 && (
        <button onClick={() => agregarAlCarrito(detail)}>
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default ItemDetail;
