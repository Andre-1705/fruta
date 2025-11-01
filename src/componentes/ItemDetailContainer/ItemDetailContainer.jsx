import { useParams } from "react-router-dom";
import { useContext } from "react";
import './ItemDetailContainer.css';
import { ItemDetail } from '../ItemDetail/ItemDetail.jsx';
import { ProductosContexto } from "../../contexto/ProductosContexto.jsx";

const ItemDetailContainer = () => {
  const { id } = useParams();
  const { productosArray, cargando, error } = useContext(ProductosContexto);

  // Convertir id a número para búsqueda más eficiente y precisa
  const productoId = id ? parseInt(id, 10) : null;
  const producto = productoId && !isNaN(productoId) 
    ? productosArray.find(p => p.id === productoId)
    : null;

// Busca en el array de productos el producto y lo guarda en producto (estaba dupliacado)
// Si no esta cargando que busque y compare el valor de un id (convertido a un string) con otro
// Si no encuentra el producto mensaje de error

  return (
    <section className="item-detail-container">
      {cargando && <p className="cargando">Cargando producto...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && !producto && (
        <p className="mensaje-error">Producto no encontrado</p>
      )}

      {!cargando && producto && <ItemDetail detail={producto} />}
    </section>
  );
};

export default ItemDetailContainer;
