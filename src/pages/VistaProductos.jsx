import './VistaProductos.css';
import ItemListContainer from '../componentes/ItemListContainer/ItemListContainer.jsx';

const VistaProductos = ({ carrito, agregarAlCarrito, removerDelCarrito }) => {
  return (
    <div className="vista-productos">
      <h1>Elegí cliqueando en la foto los productos para el carrito</h1>
      <ItemListContainer
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
      />
    </div>
  );
};

export default VistaProductos;
