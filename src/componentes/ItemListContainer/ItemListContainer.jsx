import { ItemList } from "../ItemList/ItemList";
import { useState } from "react";
import { useEffect } from "react";
import './ItemListContainer.css';

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

  return (
    <section className="fila">
      <h1>{titulo}</h1>
      {cargndo && <p>Cargando productos...</p>}
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