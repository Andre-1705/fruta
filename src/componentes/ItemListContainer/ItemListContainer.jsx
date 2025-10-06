import { useState, useEffect } from 'react';
import ItemList from '../ItemList/ItemList.jsx';
import './ItemListContainer.css';


const ItemListContainer = ({ carrito, agregarAlCarrito, removerDelCarrito }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Posible Api
     fetch('/data/productosArray.json')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON");
        return respuesta.json();
      })
      .then(data => {

        setProductosArray(data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setError("Problema al cargar productos. Intente nuevamente");
        setCargando(false);
      });
  }, []);



  return (
    <section className="item-list-container">
      {cargando && <p className="cargando">Cargando Productos</p>}
      {error && <p className ="error">{error}</p>}

      {!cargando && !error && (

        <ItemList
          lista={productosArray}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          removerDelCarrito={removerDelCarrito}
        />
        )}
    </section>
  );
};

export default ItemListContainer;
