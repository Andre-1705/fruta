import './VistaProductos.css';
import ItemListContainer from '../componentes/ItemListContainer/ItemListContainer.jsx';

const VistaProductos = ({ carrito, agregarAlCarrito, removerDelCarrito }) => {
  return (
    <div className="vista-productos">
      <h1>Seleccione productos por categoría</h1>
      <ItemListContainer
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
      />
    </div>
  );
};

export default VistaProductos;
