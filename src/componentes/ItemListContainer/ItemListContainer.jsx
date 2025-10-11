import { useContext } from 'react';
import ItemList from '../ItemList/ItemList.jsx';
import './ItemListContainer.css';
import { ProductosContexto } from '../../contexto/ProductosContexto.jsx';

const ItemListContainer = () => {
  const { productosArray, cargando, error } = useContext(ProductosContexto);

  return (
    <section className="item-list-container">
      {cargando && <p className="cargando">Cargando Productos...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <ItemList lista={productosArray} />
      )}
    </section>
  );
};

export default ItemListContainer;
