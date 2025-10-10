import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContext } from '../contexto/CarritoContexto.jsx';
import './ItemDetail.css';

export const ItemDetail = ({ lista }) => {
  const { id } = useParams();
  const { agregarAlCarrito } = useContext(CarritoContext);

  // Buscar el producto por ID

  const producto = lista.find(p => p.id.toString() === id);

  // si no se encuentra el producto, mostrar mensaje

  if (!producto) {
    return <p className="mensaje-error">Producto no encontrado</p>;
  }

  const { nombre, precio, descripcion, img, stock } = producto;

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
        <button onClick={() => agregarAlCarrito(producto)}>
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default ItemDetail;
