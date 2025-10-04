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


/*


export const ItemListContainer = ({
  titulo,
  carrito,
  agregarAlCarrito,
  removerDelCarrito
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [productosArray, setProductosArray] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

    //Este hook se ejecuta una sola vez al montar el componente, gracias al array vacío
    //Pide al JSON que le pase los productos
    //Verifica si la respuesta fue exitosa. Si no, lanza un error.
    //Si todo va bien, convierte la respuesta en JSON y:
    //Guarda los datos en el estado
    //Cambia el estado de cargando a falso

    useEffect(() => {
    fetch('/data/productosArray.json')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON");
        return respuesta.json();
      })
      .then(dato => {
        setProductosArray(dato);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setError("Problema al cargar productos. Intente nuevamente");
        setCargando(false);
      });
  }, []);

//ItemList recibe varios props para manejar el hover y las funciones de carrito
//Muestra mensaje de cargando mientras de forma asincrona se cargan los productos
//Muestra mensaje de error si hay un problema al cargar los productos

  return (
    <section className="item-list-container">

      {cargando && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (

      <ItemList
        lista={productosArray}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
        carrito={carrito}
      />
      )}
    </section>
  );
};

export default ItemListContainer;
*/
