import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ItemList from '../ItemList/ItemList.jsx';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';
import './ItemListContainer.css';

const ItemListContainer = () => {
  const { categoria } = useParams();
  const { productosArray, cargando, error } = useContext(ProductosContexto);

  // Validar que productosArray sea un array antes de usar filter
  const productosFiltrados = Array.isArray(productosArray)
    ? (categoria
        ? productosArray.filter(p => p?.categoria?.toLowerCase() === categoria.toLowerCase())
        : productosArray)
    : [];

  return (
    <section className="item-list-container">
      {cargando && <p className="cargando">Cargando Productos...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && (
        <>
          <h1 className="titulo-categoria">
            Productos disponibles: {categoria || 'Todas las categorías'}
          </h1>
          <ItemList lista={productosFiltrados} categoria={categoria} />
        </>
      )}
    </section>
  );
};

export default ItemListContainer;


//Renderiza un párrafo con el texto "Cargando Productos..." solo si el estado cargando es true.
//Con && si esto es verdadero, entonces muestra esto
//Si no está cargando y no hay error, entonces se renderiza el componente ItemList
//Se le pasa la prop lista={productos}, que contiene los productos filtrados por categoría
//Este es el render principal: muestra los productos solo cuando todo está listo

