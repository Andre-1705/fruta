import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx';

export default function Producto({ lista }) {
  const { id } = useParams();
  const { agregarAlCarrito } = useContext(CarritoContexto);

  const producto = lista.find(p => p.id.toString() === id);

  if (!producto) return <p>Producto no encontrado</p>;

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
        <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
      )}
    </div>
  );
}

