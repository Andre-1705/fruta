
import { useParams } from 'react-router-dom';
import ItemDetailContainer from '../components/ItemDetailContainer/ItemDetailContainer.jsx';

// Este componente actúa como wrapper y delega la lógica a ItemDetailContainer,
// pero puede usarse para agregar visuales o lógica adicional como stock, layout, etc.

export default function Producto() {
  const { id } = useParams();

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

     <ItemDetailContainer id={id} />

     </div>
  );
};



