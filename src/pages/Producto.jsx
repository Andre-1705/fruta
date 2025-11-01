import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProductosContexto } from '../contexto/ProductosContexto.jsx';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx';
import ItemDetailContainer from '../componentes/ItemDetailContainer/ItemDetailContainer.jsx';

// Este componente actúa como wrapper y delega la lógica a ItemDetailContainer,
// pero puede usarse para agregar visuales o lógica adicional como stock, layout, etc.

export default function Producto() {
  const { id } = useParams();
  const { productosArray, cargando, error } = useContext(ProductosContexto);
  const { agregarAlCarrito } = useContext(CarritoContexto);

  // Buscar el producto por id
  const producto = productosArray.find(p => p.id.toString() === id);

  // Si no está cargando y hay producto, mostrar información adicional
  if (!cargando && !error && producto) {
    const { nombre, precio, descripcion, img, stock, categoria } = producto;

    return (
      <div className="detalle-producto">
        {/* Información adicional del producto */}
        <div className="producto-info-extra">
          <h2>{nombre}</h2>
          <img src={img} alt={nombre} />
          <p>{descripcion}</p>
          <p>Categoría: {categoria}</p>
          <p>Precio: ${precio}</p>
          <p className={stock > 0 ? "stock-ok" : "stock-out"}>
            {stock > 0 ? `Stock disponible: ${stock} unidades` : "Sin stock"}
          </p>
          {stock > 0 && (
            <button onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    );
  }

  // Si está cargando, con error, o no hay producto, delegar a ItemDetailContainer
  return <ItemDetailContainer />;
}

