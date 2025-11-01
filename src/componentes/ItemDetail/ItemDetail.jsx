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
  
  // Validar que stock sea un número válido
  const stockNum = Number(stock);
  const tieneStock = !isNaN(stockNum) && stockNum > 0;

  return (
    <div className="detalle-producto">
      <h2>{nombre}</h2>
      <img src={img} alt={nombre} />
      <p>{descripcion}</p>
      <p>Precio: ${precio}</p>
      <p className={tieneStock ? "stock-ok" : "stock-out"}>
        {tieneStock ? `Stock disponible: ${stockNum}` : "Sin stock"}
      </p>

      {tieneStock && (
        <button onClick={() => agregarAlCarrito(detail)}>
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default ItemDetail;
