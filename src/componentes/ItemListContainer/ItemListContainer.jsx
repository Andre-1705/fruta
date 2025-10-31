import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemList from '../ItemList/ItemList.jsx';
import './ItemListContainer.css';

const ItemListContainer = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/productosArray.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar los productos');
        }
        return res.json();
      })
      .then(data => {
        const filtrados = categoria
          ? data.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
          : data;
        setProductos(filtrados);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, [categoria]);

  return (
    <section className="item-list-container">
      {cargando && <p className="cargando">Cargando Productos...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && (
      <>
      <h1 className="titulo-categoria">
        Productos disponibles: {categoria || 'Todas las categorías'}
      </h1>
      <ItemList lista={productos} categoria={categoria}/>
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
